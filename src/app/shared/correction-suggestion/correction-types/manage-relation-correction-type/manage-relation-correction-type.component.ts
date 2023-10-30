import { NotificationsService } from './../../../notifications/notifications.service';
import { OpenaireBrokerEventObject } from './../../../../core/openaire/broker/models/openaire-broker-event.model';
import { getFirstSucceededRemoteDataPayload } from './../../../../core/shared/operators';
import { ItemDataService } from './../../../../core/data/item-data.service';
import { OpenaireBrokerEventRestService } from './../../../../core/openaire/broker/events/openaire-broker-event-rest.service';
import { Context } from './../../../../core/shared/context.model';
import { CollectionElementLinkType } from './../../../object-collection/collection-element-link.type';
import { DSpaceObject } from './../../../../core/shared/dspace-object.model';
import { SearchResult } from './../../../search/models/search-result.model';
import { RemoteData } from './../../../../core/data/remote-data';
import { PaginatedList } from './../../../../core/data/paginated-list.model';
import { PaginatedSearchOptions } from './../../../search/models/paginated-search-options.model';
import { SelectableListService } from './../../../object-list/selectable-list/selectable-list.service';
import { SearchService } from './../../../../core/shared/search/search.service';
import { PaginationComponentOptions } from './../../../pagination/pagination-component-options.model';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { renderCorrectionFor } from '../../correction-suggestion-page.decorator';
import { CorrectionTypeMode } from '../../../../core/submission/models/correction-type-mode.model';
import { CorrectionTypeForms } from './../correction-type-forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subscription, of as observableOf, switchMap } from 'rxjs';
import { hasValue, isNotEmpty } from '../../../../shared/empty.util';
import { ListableObject } from '../../../../shared/object-collection/shared/listable-object.model';
import { Item } from '../../../../core/shared/item.model';
import { ImportType } from '../../../../openaire/broker/project-entry-import-modal/project-entry-import-modal.component';

@Component({
  selector: 'ds-manage-relation-correction-type',
  templateUrl: './manage-relation-correction-type.component.html',
  styleUrls: ['./manage-relation-correction-type.component.scss']
})
@renderCorrectionFor(CorrectionTypeForms.MANAGE_RELATION)
export class ManageRelationCorrectionTypeComponent implements OnInit, OnDestroy {

  /**
   * The correction type object
   */
  correctionType: CorrectionTypeMode;

  /**
   * The item uuid from the parent object
   */
  itemUuid: string;

  /**
   * The project title from the parent object
   */
  projectTitle = '';

  /**
   * Pagination options
   */
  pagination: PaginationComponentOptions;

  /**
   * The number of results per page
   */
  pageSize = 3;

  /**
   * Entities to show in the list
   */
  localEntitiesRD$: Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>>;

  /**
   * Search options to use for fetching projects
   */
  searchOptions: PaginatedSearchOptions;

  /**
   * The list of subscriptions
   */
  protected subs: Subscription[] = [];

  /**
   * Information about the data loading status
   */
  isLoading$ = observableOf(true);

  /**
   * The selected local entity
   */
  selectedEntity: ListableObject;

  /**
   * The type of link to render in listable elements
   */
  linkTypes = CollectionElementLinkType;

  /**
   * The context we're currently in (submission)
   */
  context = Context.Search;

  /**
   * List ID for selecting local entities
   */
  entityListId = 'correction-suggestion-manage-relation';
  /**
   * List ID for selecting local authorities
   */
  authorityListId = 'correction-suggestion-manage-relation-authority';

  /**
 * ImportType enum
 */
  importType = ImportType;

  /**
   * The type of import the user currently has selected
   */
  selectedImportType = ImportType.None;

  constructor(
    @Inject('correctionTypeObjectProvider') private correctionTypeObject: CorrectionTypeMode,
    public searchService: SearchService,
    private selectService: SelectableListService,
    private aroute: ActivatedRoute,
    private openaireBrokerEventRestService: OpenaireBrokerEventRestService,
    private itemService: ItemDataService,
    private notificationsService: NotificationsService,
    private router: Router
  ) {
    this.correctionType = correctionTypeObject;
    this.aroute.params.subscribe((params: Params) => {
      this.itemUuid = params.uuid;
    });
  }

  /**
   * Get the search results
   */
  ngOnInit(): void {
    this.pagination = Object.assign(new PaginationComponentOptions(), { id: 'correction-suggestion-manage-relation', pageSize: this.pageSize });
    this.searchOptions = Object.assign(new PaginatedSearchOptions(
      {
        configuration: this.correctionType.discoveryConfiguration,
        scope: this.itemUuid,
        pagination: this.pagination
      }
    ));

    this.localEntitiesRD$ = this.searchService.search(this.searchOptions);
    this.subs.push(
      this.localEntitiesRD$.subscribe(
        () => this.isLoading$ = observableOf(false)
      )
    );
  }


  /**
   * Perform a project search by title.
   */
  public search(searchTitle): void {
    if (isNotEmpty(searchTitle)) {
      const filterRegEx = /[:]/g;
      this.isLoading$ = observableOf(true);
      this.searchOptions = Object.assign(new PaginatedSearchOptions(
        {
          configuration: this.correctionType.discoveryConfiguration,
          query: (searchTitle) ? searchTitle.replace(filterRegEx, '') : searchTitle,
          scope: this.itemUuid,
          pagination: this.pagination
        }
      ));
      this.localEntitiesRD$ = this.searchService.search(this.searchOptions);
      this.subs.push(
        this.localEntitiesRD$.subscribe(
          () => this.isLoading$ = observableOf(false)
        )
      );
    }
  }

  /**
   * Deselected a local entity
   */
  public deselectEntity(): void {
    this.selectedEntity = undefined;
    if (this.selectedImportType === ImportType.LocalEntity) {
      this.selectedImportType = ImportType.None;
    }
  }

  /**
   * Selected a local entity
   * @param entity
   */
  public selectEntity(entity): void {
    this.selectedEntity = entity;
    this.selectedImportType = ImportType.LocalEntity;
  }

  /**
   * Deselect every element from both entity and authority lists
   */
  public deselectAllLists(): void {
    this.selectService.deselectAll(this.entityListId);
    this.selectService.deselectAll(this.authorityListId);
  }

  /**
   * Perform the action based on the correction type
   * by posting the data to the OpenAIRE Broker Event API.
   * Data is formatted as follows, in the exact order:
   * <item link>
   * <selected entity link>
   * <correction type link>
   */
  performAction() {
    if (hasValue(this.selectedEntity)) {
      const selectedItemLink = (this.selectedEntity as SearchResult<DSpaceObject>).indexableObject._links.self.href;

      this.itemService.findById(this.itemUuid).pipe(
        getFirstSucceededRemoteDataPayload(),
        switchMap((item: Item) => {
          console.log(item);
          const data: string = item._links.self.href + '\n' + selectedItemLink + '\n' + this.correctionTypeObject._links.self.href;
          return this.openaireBrokerEventRestService.postData(data);
        })
      ).subscribe((res: RemoteData<OpenaireBrokerEventObject>) => {
        if (res.hasSucceeded) {
          this.selectedImportType = ImportType.None;
          // TODO: show success message based on the type of correction
          this.notificationsService.success('Correction suggestion submitted', 'The correction suggestion has been submitted');
          this.deselectAllLists();
          this.back();
        } else {
          this.notificationsService.error('Error submitting correction suggestion', 'The correction suggestion could not be submitted');
        }
      });
    }
  }

  /**
   * Navigate back to the previous page
   */
  back() {
    this.router.navigate(['../'], { relativeTo: this.aroute });
  }

  /**
 * Unsubscribe from all subscriptions.
 */
  ngOnDestroy(): void {
    this.deselectAllLists();
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }
}
