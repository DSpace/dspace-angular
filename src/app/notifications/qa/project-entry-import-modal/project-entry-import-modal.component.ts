import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of as observableOf,
  Subscription,
} from 'rxjs';

import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import {
  QualityAssuranceEventObject,
  SourceQualityAssuranceEventMessageObject,
} from '../../../core/notifications/qa/models/quality-assurance-event.model';
import { Context } from '../../../core/shared/context.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { Item } from '../../../core/shared/item.model';
import { SearchService } from '../../../core/shared/search/search.service';
import { AlertComponent } from '../../../shared/alert/alert.component';
import {
  hasValue,
  isNotEmpty,
} from '../../../shared/empty.util';
import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import { CollectionElementLinkType } from '../../../shared/object-collection/collection-element-link.type';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { SelectableListService } from '../../../shared/object-list/selectable-list/selectable-list.service';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../../shared/search/models/paginated-search-options.model';
import { SearchResult } from '../../../shared/search/models/search-result.model';
import { ThemedSearchResultsComponent } from '../../../shared/search/search-results/themed-search-results.component';

/**
 * The possible types of import for the external entry
 */
export enum ImportType {
  None = 'None',
  LocalEntity = 'LocalEntity',
  LocalAuthority = 'LocalAuthority',
  NewEntity = 'NewEntity',
  NewAuthority = 'NewAuthority'
}

/**
 * The data type passed from the parent page
 */
export interface QualityAssuranceEventData {
  /**
   * The Quality Assurance event
   */
  event: QualityAssuranceEventObject;
  /**
   * The Quality Assurance event Id (uuid)
   */
  id: string;
  /**
   * The publication title
   */
  title: string;
  /**
   * Contains the boolean that indicates if a project is present
   */
  hasProject: boolean;
  /**
   * The project title, if present
   */
  projectTitle: string;
  /**
   * The project id (uuid), if present
   */
  projectId: string;
  /**
   * The project handle, if present
   */
  handle: string;
  /**
   * The reject/discard reason
   */
  reason: string;
  /**
   * Contains the boolean that indicates if there is a running operation (REST call)
   */
  isRunning: boolean;
  /**
   * The related publication DSpace item
   */
  target?: Item;
}

@Component({
  selector: 'ds-project-entry-import-modal',
  styleUrls: ['./project-entry-import-modal.component.scss'],
  templateUrl: './project-entry-import-modal.component.html',
  standalone: true,
  imports: [RouterLink, NgIf, FormsModule, ThemedLoadingComponent, ThemedSearchResultsComponent, AlertComponent, AsyncPipe, TranslateModule],
})
/**
 * Component to display a modal window for linking a project to an Quality Assurance event
 * Shows information about the selected project and a selectable list.
 */
export class ProjectEntryImportModalComponent implements OnInit {
  /**
   * The external source entry
   */
  @Input() externalSourceEntry: QualityAssuranceEventData;
  /**
   * The number of results per page
   */
  pageSize = 3;
  /**
   * The prefix for every i18n key within this modal
   */
  labelPrefix = 'quality-assurance.event.modal.';
  /**
   * The search configuration to retrieve project
   */
  configuration = 'funding';
  /**
   * The label to use for all messages (added to the end of relevant i18n keys)
   */
  label: string;
  /**
   * The project title from the parent object
   */
  projectTitle: string;
  /**
   * The search results
   */
  localEntitiesRD$: Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>>;
  /**
   * Information about the data loading status
   */
  isLoading$ = observableOf(true);
  /**
   * Search options to use for fetching projects
   */
  searchOptions: PaginatedSearchOptions;
  /**
   * The context we're currently in (submission)
   */
  context = Context.EntitySearchModalWithNameVariants;
  /**
   * List ID for selecting local entities
   */
  entityListId = 'notifications-project-bound';
  /**
   * List ID for selecting local authorities
   */
  authorityListId = 'notifications-project-bound-authority';
  /**
   * ImportType enum
   */
  importType = ImportType;
  /**
   * The type of link to render in listable elements
   */
  linkTypes = CollectionElementLinkType;
  /**
   * The type of import the user currently has selected
   */
  selectedImportType = ImportType.None;
  /**
   * The selected local entity
   */
  selectedEntity: ListableObject;
  /**
   * An project has been selected, send it to the parent component
   */
  importedObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();
  /**
   * Pagination options
   */
  pagination: PaginationComponentOptions;
  /**
   * Array to track all the component subscriptions. Useful to unsubscribe them with 'onDestroy'.
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  /**
   * Initialize the component variables.
   * @param {NgbActiveModal} modal
   * @param {SearchService} searchService
   * @param {SelectableListService} selectService
   */
  constructor(public modal: NgbActiveModal,
              public searchService: SearchService,
              private selectService: SelectableListService) { }

  /**
   * Component intitialization.
   */
  public ngOnInit(): void {
    this.pagination = Object.assign(new PaginationComponentOptions(), { id: 'notifications-project-bound', pageSize: this.pageSize });
    this.projectTitle = (this.externalSourceEntry.projectTitle !== null) ? this.externalSourceEntry.projectTitle
      : (this.externalSourceEntry.event.message as SourceQualityAssuranceEventMessageObject).title;
    this.searchOptions = Object.assign(new PaginatedSearchOptions(
      {
        configuration: this.configuration,
        query: this.projectTitle,
        pagination: this.pagination,
      },
    ));
    this.localEntitiesRD$ = this.searchService.search(this.searchOptions);
    this.subs.push(
      this.localEntitiesRD$.subscribe(
        () => this.isLoading$ = observableOf(false),
      ),
    );
  }

  /**
   * Close the modal.
   */
  public close(): void {
    this.deselectAllLists();
    this.modal.close();
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
          configuration: this.configuration,
          query: (searchTitle) ? searchTitle.replace(filterRegEx, '') : searchTitle,
          pagination: this.pagination,
        },
      ));
      this.localEntitiesRD$ = this.searchService.search(this.searchOptions);
      this.subs.push(
        this.localEntitiesRD$.subscribe(
          () => this.isLoading$ = observableOf(false),
        ),
      );
    }
  }

  /**
   * Perform the bound of the project.
   */
  public bound(): void {
    if (this.selectedEntity !== undefined) {
      this.importedObject.emit(this.selectedEntity);
    }
    this.selectedImportType = ImportType.None;
    this.deselectAllLists();
    this.close();
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
   * Unsubscribe from all subscriptions.
   */
  ngOnDestroy(): void {
    this.deselectAllLists();
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }
}
