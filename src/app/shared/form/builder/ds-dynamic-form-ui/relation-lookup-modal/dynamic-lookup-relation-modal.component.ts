import {
  AsyncPipe,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  NgbActiveModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest as observableCombineLatest,
  Observable,
  Subscription,
} from 'rxjs';
import {
  map,
  skip,
  switchMap,
  take,
} from 'rxjs/operators';

import { AppState } from '../../../../../app.reducer';
import { RemoteDataBuildService } from '../../../../../core/cache/builders/remote-data-build.service';
import { RequestParam } from '../../../../../core/cache/models/request-param.model';
import { ExternalSourceDataService } from '../../../../../core/data/external-source-data.service';
import { FindListOptions } from '../../../../../core/data/find-list-options.model';
import { LookupRelationService } from '../../../../../core/data/lookup-relation.service';
import { PaginatedList } from '../../../../../core/data/paginated-list.model';
import { RelationshipDataService } from '../../../../../core/data/relationship-data.service';
import { Context } from '../../../../../core/shared/context.model';
import { DSpaceObject } from '../../../../../core/shared/dspace-object.model';
import { ExternalSource } from '../../../../../core/shared/external-source.model';
import { Item } from '../../../../../core/shared/item.model';
import { RelationshipType } from '../../../../../core/shared/item-relationships/relationship-type.model';
import {
  getAllSucceededRemoteDataPayload,
  getFirstSucceededRemoteDataPayload,
} from '../../../../../core/shared/operators';
import { SearchConfigurationService } from '../../../../../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../../my-dspace-page/my-dspace-configuration.service';
import {
  hasValue,
  isNotEmpty,
} from '../../../../empty.util';
import { ThemedLoadingComponent } from '../../../../loading/themed-loading.component';
import { ItemSearchResult } from '../../../../object-collection/shared/item-search-result.model';
import { ListableObject } from '../../../../object-collection/shared/listable-object.model';
import { SelectableListState } from '../../../../object-list/selectable-list/selectable-list.reducer';
import { SelectableListService } from '../../../../object-list/selectable-list/selectable-list.service';
import { SearchResult } from '../../../../search/models/search-result.model';
import { followLink } from '../../../../utils/follow-link-config.model';
import { RelationshipOptions } from '../../models/relationship-options.model';
import { ThemedDynamicLookupRelationExternalSourceTabComponent } from './external-source-tab/themed-dynamic-lookup-relation-external-source-tab.component';
import {
  AddRelationshipAction,
  RemoveRelationshipAction,
  UpdateRelationshipNameVariantAction,
} from './relationship.actions';
import { ThemedDynamicLookupRelationSearchTabComponent } from './search-tab/themed-dynamic-lookup-relation-search-tab.component';
import { DsDynamicLookupRelationSelectionTabComponent } from './selection-tab/dynamic-lookup-relation-selection-tab.component';

@Component({
  selector: 'ds-dynamic-lookup-relation-modal',
  styleUrls: ['./dynamic-lookup-relation-modal.component.scss'],
  templateUrl: './dynamic-lookup-relation-modal.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
  imports: [
    ThemedDynamicLookupRelationExternalSourceTabComponent,
    TranslateModule,
    ThemedLoadingComponent,
    NgIf,
    NgbNavModule,
    ThemedDynamicLookupRelationSearchTabComponent,
    AsyncPipe,
    NgForOf,
    DsDynamicLookupRelationSelectionTabComponent,
  ],
  standalone: true,
})

/**
 * Represents a modal where the submitter can select items to be added as a certain relationship type to the object being submitted
 */
export class DsDynamicLookupRelationModalComponent implements OnInit, OnDestroy {
  @Output() selectEvent: EventEmitter<ListableObject[]> = new EventEmitter<ListableObject[]>();

  /**
   * The label to use to display i18n messages (describing the type of relationship)
   */
  label: string;

  /**
   * Options for searching related items
   */
  relationshipOptions: RelationshipOptions;

  /**
   * The ID of the list to add/remove selected items to/from
   */
  listId: string;

  /**
   * The item we're adding relationships to
   */
  item;

  /**
   * The collection we're submitting an item to
   */
  collection;

  /**
   * Is the selection repeatable?
   */
  repeatable: boolean;

  /**
   * The list of selected items
   */
  selection$: Observable<ListableObject[]>;

  /**
   * The context to display lists
   */
  context: Context;

  /**
   * The metadata-fields describing these relationships
   */
  metadataFields: string;

  query: string;

  /**
   * A hidden query that will be used but not displayed in the url/searchbar
   */
  hiddenQuery: string;

  /**
   * A map of subscriptions within this component
   */
  subMap: {
    [uuid: string]: Subscription
  } = {};
  submissionId: string;

  /**
   * A list of the available external sources configured for this relationship
   */
  externalSourcesRD$: Observable<ExternalSource[]>;

  /**
   * The total amount of internal items for the current options
   */
  totalInternal$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  /**
   * The total amount of results for each external source using the current options
   */
  totalExternal$: Observable<number[]>;

  /**
   * The type of relationship
   */
  relationshipType: RelationshipType;

  /**
   * Checks if relationship is left
   */
  currentItemIsLeftItem$: Observable<boolean>;

  /**
   * Relationship is left
   */
  isLeft = false;

  /**
   * Checks if modal is being used by edit relationship page
   */
  isEditRelationship = false;

  /**
   * Maintain the list of the related items to be added
   */
  toAdd: ItemSearchResult[] = [];

  /**
   * Maintain the list of the related items to be removed
   */
  toRemove: ItemSearchResult[] = [];

  /**
   * Disable buttons while the submit button is pressed
   */
  isPending = false;

  constructor(
    public modal: NgbActiveModal,
    private selectableListService: SelectableListService,
    private relationshipService: RelationshipDataService,
    private externalSourceService: ExternalSourceDataService,
    private lookupRelationService: LookupRelationService,
    private searchConfigService: SearchConfigurationService,
    private rdbService: RemoteDataBuildService,
    private zone: NgZone,
    private store: Store<AppState>,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    if (this.currentItemIsLeftItem$) {
      this.currentItemIsLeftItem$.subscribe((isLeft) => {
        this.isLeft = isLeft;
        this.label = this.relationshipType.leftwardType;
      });
    }

    this.selection$ = this.selectableListService
      .getSelectableList(this.listId)
      .pipe(map((listState: SelectableListState) => hasValue(listState) && hasValue(listState.selection) ? listState.selection : []));
    this.selection$.pipe(take(1)).subscribe((selection) =>
      selection.map((s: SearchResult<Item>) => this.addNameVariantSubscription(s)),
    );
    if (this.relationshipOptions.nameVariants === 'true') {
      this.context = Context.EntitySearchModalWithNameVariants;
    } else {
      this.context = Context.EntitySearchModal;
    }

    if (isNotEmpty(this.relationshipOptions.externalSources)) {
      this.externalSourcesRD$ = this.rdbService.aggregate(
        this.relationshipOptions.externalSources.map((source) => {
          return this.externalSourceService.findById(
            source,
            true,
            true,
            followLink('entityTypes'),
          );
        }),
      ).pipe(
        getAllSucceededRemoteDataPayload(),
      );
    } else {
      const findListOptions = Object.assign({}, new FindListOptions(), {
        elementsPerPage: 5,
        currentPage: 1,
        searchParams: [
          new RequestParam('entityType', this.relationshipOptions.relationshipType),
        ],
      });
      this.externalSourcesRD$ = this.externalSourceService.searchBy('findByEntityType', findListOptions,
        true, true, followLink('entityTypes'))
        .pipe(getFirstSucceededRemoteDataPayload(), map((r: PaginatedList<ExternalSource>) => {
          return r.page;
        }));
    }

    this.setTotals();
  }

  close() {
    this.toAdd = [];
    this.toRemove = [];
    this.modal.close();
    this.closeEv();
  }

  /**
   * Select (a list of) objects and add them to the store
   * @param selectableObjects
   */
  select(...selectableObjects: SearchResult<DSpaceObject>[]) {
    this.zone.runOutsideAngular(
      () => {
        const obs: Observable<any[]> = observableCombineLatest([...selectableObjects.map((sri: SearchResult<Item>) => {
          this.addNameVariantSubscription(sri);
          return this.relationshipService.getNameVariant(this.listId, sri.indexableObject.uuid)
            .pipe(
              take(1),
              map((nameVariant: string) => {
                return {
                  item: sri.indexableObject,
                  nameVariant,
                };
              }),
            );
        }),
        ]);
        obs
          .subscribe((arr: any[]) => {
            return arr.forEach((object: any) => {
              const addRelationshipAction = new AddRelationshipAction(this.item, object.item, this.relationshipOptions.relationshipType, this.submissionId, object.nameVariant);
              this.store.dispatch(addRelationshipAction);
            },
            );
          });
      });
  }

  /**
   * Add a subscription updating relationships with name variants
   * @param sri The search result to track name variants for
   */
  private addNameVariantSubscription(sri: SearchResult<Item>) {
    const nameVariant$ = this.relationshipService.getNameVariant(this.listId, sri.indexableObject.uuid);
    this.subMap[sri.indexableObject.uuid] = nameVariant$.pipe(
      skip(1),
    ).subscribe((nameVariant: string) => this.store.dispatch(new UpdateRelationshipNameVariantAction(this.item, sri.indexableObject, this.relationshipOptions.relationshipType, this.submissionId, nameVariant)));
  }

  /**
   * Deselect (a list of) objects and remove them from the store
   * @param selectableObjects
   */
  deselect(...selectableObjects: SearchResult<DSpaceObject>[]) {
    this.zone.runOutsideAngular(
      () => selectableObjects.forEach((object) => {
        this.subMap[object.indexableObject.uuid].unsubscribe();
        this.store.dispatch(new RemoveRelationshipAction(this.item, object.indexableObject as Item, this.relationshipOptions.relationshipType, this.submissionId));
      }),
    );
  }

  /**
   * Called when an external object has been imported, resets the total values and adds the object to the selected list
   * @param object
   */
  imported(object) {
    this.setTotals();
    this.select(object);
  }

  /**
   * Calculate and set the total entries available for each tab
   */
  setTotals() {
    const externalSourcesAndOptions$ = observableCombineLatest([
      this.externalSourcesRD$,
      this.searchConfigService.paginatedSearchOptions,
    ]);

    this.totalExternal$ = externalSourcesAndOptions$.pipe(
      switchMap(([sources, options]) =>
        observableCombineLatest([...sources.map((source: ExternalSource) => this.lookupRelationService.getTotalExternalResults(source, options))])),
    );
  }


  setTotalInternals(totalPages: number) {
    this.totalInternal$.next(totalPages);
  }

  ngOnDestroy() {
    this.router.navigate([], {});
    Object.values(this.subMap).forEach((subscription) => subscription.unsubscribe());
  }

  /* eslint-disable no-empty,@typescript-eslint/no-empty-function */
  /**
   * Called when close button is clicked
   */
  closeEv(): void {
  }

  /**
   * Called when discard button is clicked
   */
  discardEv(): void {
  }

  /**
   * Called when submit button is clicked
   */
  submitEv(): void {
  }
  /* eslint-enable no-empty, @typescript-eslint/no-empty-function */

}
