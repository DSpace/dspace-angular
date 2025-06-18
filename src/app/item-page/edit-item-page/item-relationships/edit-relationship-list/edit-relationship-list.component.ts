import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest as observableCombineLatest,
  EMPTY,
  from as observableFrom,
  Observable,
  Subscription,
} from 'rxjs';
import {
  concatMap,
  defaultIfEmpty,
  map,
  mergeMap,
  startWith,
  switchMap,
  take,
  tap,
  toArray,
} from 'rxjs/operators';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../../../config/app-config.interface';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { RequestParam } from '../../../../core/cache/models/request-param.model';
import { FieldChangeType } from '../../../../core/data/object-updates/field-change-type.model';
import { FieldUpdate } from '../../../../core/data/object-updates/field-update.model';
import { FieldUpdates } from '../../../../core/data/object-updates/field-updates.model';
import { RelationshipIdentifiable } from '../../../../core/data/object-updates/object-updates.reducer';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { RelationshipDataService } from '../../../../core/data/relationship-data.service';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { Collection } from '../../../../core/shared/collection.model';
import { Item } from '../../../../core/shared/item.model';
import { ItemType } from '../../../../core/shared/item-relationships/item-type.model';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { RelationshipType } from '../../../../core/shared/item-relationships/relationship-type.model';
import {
  getAllSucceededRemoteData,
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload,
  getRemoteDataPayload,
} from '../../../../core/shared/operators';
import { BtnDisabledDirective } from '../../../../shared/btn-disabled.directive';
import {
  hasNoValue,
  hasValue,
  hasValueOperator,
  isNotEmpty,
} from '../../../../shared/empty.util';
import { DsDynamicLookupRelationModalComponent } from '../../../../shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/dynamic-lookup-relation-modal.component';
import { RelationshipOptions } from '../../../../shared/form/builder/models/relationship-options.model';
import { ThemedLoadingComponent } from '../../../../shared/loading/themed-loading.component';
import { ItemSearchResult } from '../../../../shared/object-collection/shared/item-search-result.model';
import { SelectableListService } from '../../../../shared/object-list/selectable-list/selectable-list.service';
import { PaginationComponent } from '../../../../shared/pagination/pagination.component';
import { PaginationComponentOptions } from '../../../../shared/pagination/pagination-component-options.model';
import { FollowLinkConfig } from '../../../../shared/utils/follow-link-config.model';
import { ObjectValuesPipe } from '../../../../shared/utils/object-values-pipe';
import { itemLinksToFollow } from '../../../../shared/utils/relation-query.utils';
import { VarDirective } from '../../../../shared/utils/var.directive';
import { EditItemRelationshipsService } from '../edit-item-relationships.service';
import { EditRelationshipComponent } from '../edit-relationship/edit-relationship.component';

@Component({
  selector: 'ds-edit-relationship-list',
  styleUrls: ['./edit-relationship-list.component.scss'],
  templateUrl: './edit-relationship-list.component.html',
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    EditRelationshipComponent,
    NgClass,
    ObjectValuesPipe,
    PaginationComponent,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
  standalone: true,
})
/**
 * A component creating a list of editable relationships of a certain type
 * The relationships are rendered as a list of related items
 */
export class EditRelationshipListComponent implements OnInit, OnDestroy {

  /**
   * The item to display related items for
   */
  @Input() item: Item;

  @Input() itemType: ItemType;

  /**
   * The URL to the current page
   * Used to fetch updates for the current item from the store
   */
  @Input() url: string;

  /**
   * The label of the relationship-type we're rendering a list for
   */
  @Input() relationshipType: RelationshipType;

  /**
   * If updated information has changed
   */
  @Input() hasChanges!: Observable<boolean>;

  /**
   * The event emmiter to submit the new information
   */
  @Output() submitModal: EventEmitter<void> = new EventEmitter();

  /**
   * Observable that emits the left and right item type of {@link relationshipType} simultaneously.
   */
  private relationshipLeftAndRightType$: Observable<[ItemType, ItemType]>;

  /**
   * Observable that emits true if {@link itemType} is on the left-hand side of {@link relationshipType},
   * false if it is on the right-hand side and undefined in the rare case that it is on neither side.
   */
  @Input() currentItemIsLeftItem$: BehaviorSubject<boolean> = new BehaviorSubject(undefined);

  relatedEntityType$: Observable<ItemType>;

  /**
   * The translation key for the entity type
   */
  relationshipMessageKey$: Observable<string>;

  currentEntityType$: Observable<ItemType>;

  /**
   * The list ID to save selected entities under
   */
  listId: string;

  /**
   * The FieldUpdates for the relationships in question
   */
  updates$: BehaviorSubject<FieldUpdates> = new BehaviorSubject(undefined);

  /**
   * The RemoteData for the relationships
   */
  relationshipsRd$: BehaviorSubject<RemoteData<PaginatedList<Relationship>>> = new BehaviorSubject(undefined);

  /**
   * Whether the current page is the last page
   */
  isLastPage$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  /**
   * Whether we're loading
   */
  loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  /**
   * The number of added fields that haven't been saved yet
   */
  nbAddedFields$: BehaviorSubject<number> = new BehaviorSubject(0);

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

  /**
   * The pagination config
   */
  paginationConfig: PaginationComponentOptions;

  /**
   * A reference to the lookup window
   */
  modalRef: NgbModalRef;

  /**
   * Determines whether to ask for the embedded item thumbnail.
   */
  fetchThumbnail: boolean;

  constructor(
    protected objectUpdatesService: ObjectUpdatesService,
    protected linkService: LinkService,
    protected relationshipService: RelationshipDataService,
    protected modalService: NgbModal,
    protected paginationService: PaginationService,
    protected selectableListService: SelectableListService,
    protected editItemRelationshipsService: EditItemRelationshipsService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    this.fetchThumbnail = this.appConfig.browseBy.showThumbnails;
  }

  /**
   * Get the i18n message key for this relationship type
   */
  public getRelationshipMessageKey(): Observable<string> {
    return observableCombineLatest([
      this.currentEntityType$,
      this.getLabel(),
      this.relatedEntityType$,
    ]).pipe(
      map(([currentEntityType, label, relatedEntityType]: [ItemType, string, ItemType]) => {
        return `relationships.${currentEntityType.label}.${label}.${relatedEntityType.label}`;
      }),
    );
  }

  /**
   * Get the relevant label for this relationship type
   */
  private getLabel(): Observable<string> {
    return this.currentItemIsLeftItem$.pipe(
      map((currentItemIsLeftItem) => {
        if (currentItemIsLeftItem) {
          return this.relationshipType.leftwardType;
        } else {
          return this.relationshipType.rightwardType;
        }
      }),
    );
  }

  /**
   * Prevent unnecessary rerendering so fields don't lose focus
   */
  trackUpdate(index, update: FieldUpdate) {
    return update && update.field ? update.field.uuid : undefined;
  }

  /**
   * Check whether the current entity can have multiple relationships of this type
   * This is based on the max cardinality of the relationship
   * @private
   */
  private isRepeatable(): boolean {
    const isLeft = this.currentItemIsLeftItem$.getValue();
    if (isLeft) {
      const leftMaxCardinality = this.relationshipType.leftMaxCardinality;
      return hasNoValue(leftMaxCardinality) || leftMaxCardinality > 1;
    } else {
      const rightMaxCardinality = this.relationshipType.rightMaxCardinality;
      return hasNoValue(rightMaxCardinality) || rightMaxCardinality > 1;
    }
  }

  /**
   * Open the dynamic lookup modal to search for items to add as relationships
   */
  openLookup() {
    this.modalRef = this.modalService.open(DsDynamicLookupRelationModalComponent, {
      size: 'lg',
    });
    const modalComp: DsDynamicLookupRelationModalComponent = this.modalRef.componentInstance;
    modalComp.repeatable = true;
    modalComp.isEditRelationship = true;
    modalComp.listId = this.listId;
    modalComp.item = this.item;
    modalComp.relationshipType = this.relationshipType;
    modalComp.currentItemIsLeftItem$ = this.currentItemIsLeftItem$;
    modalComp.toAdd = [];
    modalComp.toRemove = [];
    modalComp.isPending = false;
    modalComp.repeatable = this.isRepeatable();
    modalComp.hiddenQuery = '-search.resourceid:' + this.item.uuid;

    this.item.owningCollection.pipe(
      getFirstSucceededRemoteDataPayload(),
    ).subscribe((collection: Collection) => {
      modalComp.collection = collection;
    });

    modalComp.select = (...selectableObjects: ItemSearchResult[]) => {
      selectableObjects.forEach((searchResult) => {
        const relatedItem: Item = searchResult.indexableObject;

        const foundIndex = modalComp.toRemove.findIndex((itemSearchResult: ItemSearchResult) => itemSearchResult.indexableObject.uuid === relatedItem.uuid);

        if (foundIndex !== -1) {
          modalComp.toRemove.splice(foundIndex,1);
        } else {

          this.getRelationFromId(relatedItem)
            .subscribe((relationship: Relationship) => {
              if (!relationship ) {
                modalComp.toAdd.push(searchResult);
              } else {
                const foundIndexRemove = modalComp.toRemove.findIndex( el => el.indexableObject.uuid === relatedItem.uuid);
                if (foundIndexRemove !== -1) {
                  modalComp.toRemove.splice(foundIndexRemove,1);
                }
              }

              this.loading$.next(isNotEmpty(modalComp.toAdd) || isNotEmpty(modalComp.toRemove));
              // emit the last page again to trigger a fieldupdates refresh
              this.relationshipsRd$.next(this.relationshipsRd$.getValue());
            });
        }
      });
    };
    modalComp.deselect = (...selectableObjects: ItemSearchResult[]) => {
      selectableObjects.forEach((searchResult) => {
        const relatedItem: Item = searchResult.indexableObject;

        const foundIndex = modalComp.toAdd.findIndex( el => el.indexableObject.uuid === relatedItem.uuid);

        if (foundIndex !== -1) {
          modalComp.toAdd.splice(foundIndex,1);
        } else {
          modalComp.toRemove.push(searchResult);
        }
        this.loading$.next(isNotEmpty(modalComp.toAdd) || isNotEmpty(modalComp.toRemove));
      });
    };



    modalComp.submitEv = () => {
      modalComp.isPending = true;
      const isLeft = this.currentItemIsLeftItem$.getValue();
      const addOperations = modalComp.toAdd.map((searchResult: ItemSearchResult) => ({ type: 'add', searchResult }));
      const removeOperations = modalComp.toRemove.map((searchResult: ItemSearchResult) => ({ type: 'remove', searchResult }));
      observableFrom([...addOperations, ...removeOperations]).pipe(
        concatMap(({ type, searchResult }: { type: string, searchResult: ItemSearchResult }) => {
          const relatedItem: Item = searchResult.indexableObject;
          if (type === 'add') {
            return this.relationshipService.getNameVariant(this.listId, relatedItem.uuid).pipe(
              switchMap((nameVariant) => {
                const update = {
                  uuid: `${this.relationshipType.id}-${relatedItem.uuid}`,
                  nameVariant,
                  type: this.relationshipType,
                  originalIsLeft: isLeft,
                  originalItem: this.item,
                  relatedItem,
                } as RelationshipIdentifiable;
                return this.objectUpdatesService.saveAddFieldUpdate(this.url, update);
              }),
              take(1),
            );
          } else if (type === 'remove') {
            return this.relationshipService.getNameVariant(this.listId, relatedItem.uuid).pipe(
              switchMap((nameVariant) => {
                return this.getRelationFromId(searchResult.indexableObject).pipe(
                  map( (relationship: Relationship) => {
                    const update = {
                      uuid: relationship.id,
                      nameVariant,
                      type: this.relationshipType,
                      originalIsLeft: isLeft,
                      originalItem: this.item,
                      relatedItem,
                      relationship,
                    } as RelationshipIdentifiable;
                    return this.objectUpdatesService.saveRemoveFieldUpdate(this.url,update);
                  }),
                );
              }),
              take(1),
            );
          } else {
            return EMPTY;
          }
        }),
        toArray(),
      ).subscribe({
        complete: () => {
          this.editItemRelationshipsService.submit(this.item, this.url);
          this.submitModal.emit();
        },
      });
    };


    modalComp.discardEv = () => {
      modalComp.toAdd.forEach( (searchResult) => {
        this.selectableListService.deselectSingle(this.listId,searchResult);
      });

      modalComp.toRemove.forEach( (searchResult) => {
        this.selectableListService.selectSingle(this.listId,searchResult);
      });

      modalComp.toAdd = [];
      modalComp.toRemove = [];
      this.loading$.next(false);
    };

    modalComp.closeEv = () => {
      this.loading$.next(false);
    };

    this.relatedEntityType$
      .pipe(take(1))
      .subscribe((relatedEntityType) => {
        modalComp.relationshipOptions = Object.assign(
          new RelationshipOptions(), {
            relationshipType: relatedEntityType.label,
            searchConfiguration: relatedEntityType.label.toLowerCase(),
            nameVariants: 'true',
          },
        );
      });

    this.selectableListService.deselectAll(this.listId);
  }

  getRelationFromId(relatedItem) {
    const relationshipLabel = this.currentItemIsLeftItem$.getValue() ? this.relationshipType.leftwardType : this.relationshipType.rightwardType;
    return this.relationshipService.searchByItemsAndType( this.relationshipType.id, this.item.uuid, relationshipLabel ,[relatedItem.id] ).pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      map( (res: PaginatedList<Relationship>) => res.page[0]),
    );
  }

  ngOnInit(): void {
    // store the left and right type of the relationship in a single observable
    this.relationshipLeftAndRightType$ = observableCombineLatest([
      this.relationshipType.leftType,
      this.relationshipType.rightType,
    ].map((type) => type.pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
    ))) as Observable<[ItemType, ItemType]>;

    this.relatedEntityType$ = this.relationshipLeftAndRightType$.pipe(
      map(([leftType, rightType]: [ItemType, ItemType]) => {
        if (leftType.uuid !== this.itemType.uuid) {
          return leftType;
        } else {
          return rightType;
        }
      }),
      hasValueOperator(),
    );

    this.currentEntityType$ = this.relationshipLeftAndRightType$.pipe(
      map(([leftType, rightType]: [ItemType, ItemType]) => {
        if (leftType.uuid === this.itemType.uuid) {
          return leftType;
        } else {
          return rightType;
        }
      }),
      hasValueOperator(),
    );

    this.relatedEntityType$.pipe(
      take(1),
    ).subscribe(
      (relatedEntityType) => this.listId = `edit-relationship-${this.itemType.id}-${relatedEntityType.id}`,
    );

    this.relationshipMessageKey$ = this.getRelationshipMessageKey();


    // initialize the pagination options
    this.paginationConfig = new PaginationComponentOptions();
    this.paginationConfig.id = `er${this.relationshipType.id}`;
    this.paginationConfig.pageSize = 5;
    this.paginationConfig.currentPage = 1;

    // get the pagination params from the route
    const currentPagination$ = this.paginationService.getCurrentPagination(
      this.paginationConfig.id,
      this.paginationConfig,
    ).pipe(
      tap(() => this.loading$.next(true)),
    );

    // this adds thumbnail images when required by configuration
    const linksToFollow: FollowLinkConfig<Relationship>[] = itemLinksToFollow(this.fetchThumbnail, this.appConfig.item.showAccessStatuses);

    this.subs.push(
      observableCombineLatest([
        currentPagination$,
        this.currentItemIsLeftItem$,
        this.relatedEntityType$,
      ]).pipe(
        switchMap(([currentPagination, currentItemIsLeftItem, relatedEntityType]: [PaginationComponentOptions, boolean, ItemType]) => {
          // get the relationships for the current page, item, relationship type and related entity type
          return this.relationshipService.getItemRelationshipsByLabel(
            this.item,
            currentItemIsLeftItem ? this.relationshipType.leftwardType : this.relationshipType.rightwardType,
            {
              elementsPerPage: currentPagination.pageSize,
              currentPage: currentPagination.currentPage,
              searchParams: [
                new RequestParam('relatedEntityType', relatedEntityType.label),
              ],
            },
            true,
            true,
            ...linksToFollow,
          );
        }),
        tap((rd: RemoteData<PaginatedList<Relationship>>) => {
          this.relationshipsRd$.next(rd);
        }),
        getAllSucceededRemoteData(),
        getRemoteDataPayload(),
      ).subscribe((relationshipPaginatedList: PaginatedList<Relationship>) => {
        this.objectUpdatesService.initialize(this.url, relationshipPaginatedList.page, new Date());
      }),
    );

    // keep isLastPage$ up to date based on relationshipsRd$
    this.subs.push(this.relationshipsRd$.pipe(
      hasValueOperator(),
      getAllSucceededRemoteData(),
    ).subscribe((rd: RemoteData<PaginatedList<Relationship>>) => {
      this.isLastPage$.next(hasNoValue(rd.payload._links.next));
    }));

    this.subs.push(this.relationshipsRd$.pipe(
      hasValueOperator(),
      getAllSucceededRemoteData(),
      switchMap((rd: RemoteData<PaginatedList<Relationship>>) =>
        // emit each relationship in the page separately
        observableFrom(rd.payload.page).pipe(
          mergeMap((relationship: Relationship) =>
            // check for each relationship whether it's the left item
            this.relationshipService.isLeftItem(relationship, this.item).pipe(
              // emit an array containing both the relationship and whether it's the left item,
              // as we'll need both
              switchMap((isLeftItem: boolean) => {
                if (isLeftItem) {
                  return relationship.rightItem.pipe(
                    getFirstCompletedRemoteData(),
                    getRemoteDataPayload(),
                    map((relatedItem: Item) => [relationship, isLeftItem, relatedItem]),
                  );
                } else {
                  return relationship.leftItem.pipe(
                    getFirstCompletedRemoteData(),
                    getRemoteDataPayload(),
                    map((relatedItem: Item) => [relationship, isLeftItem, relatedItem]),
                  );
                }
              }),
            ),
          ),
          map(([relationship, isLeftItem, relatedItem]: [Relationship, boolean, Item]) => {
            // turn it into a RelationshipIdentifiable, an
            const nameVariant =
              isLeftItem ? relationship.rightwardValue : relationship.leftwardValue;
            return {
              uuid: relationship.id,
              type: this.relationshipType,
              relationship,
              originalIsLeft: isLeftItem,
              originalItem: this.item,
              relatedItem: relatedItem,
              nameVariant,
            } as RelationshipIdentifiable;
          }),
          // wait until all relationships have been processed, and emit them all as a single array
          toArray(),
          // if the pipe above completes without emitting anything, emit an empty array instead
          defaultIfEmpty([]),
        )),
      switchMap((nextFields: RelationshipIdentifiable[]) => {
        // Get a list that contains the unsaved changes for the page, as well as the page of
        // RelationshipIdentifiables, as a single list of FieldUpdates
        return this.objectUpdatesService.getFieldUpdates(this.url, nextFields).pipe(
          map((fieldUpdates: FieldUpdates) => {
            const fieldUpdatesFiltered: FieldUpdates = {};
            this.nbAddedFields$.next(0);
            // iterate over the fieldupdates and filter out the ones that pertain to this
            // relationshiptype
            Object.keys(fieldUpdates).forEach((uuid) => {
              if (hasValue(fieldUpdates[uuid])) {
                const field = fieldUpdates[uuid].field as RelationshipIdentifiable;
                // only include fieldupdates regarding this RelationshipType
                if (field.type.id === this.relationshipType.id) {
                  // if it's a newly added relationship
                  if (fieldUpdates[uuid].changeType === FieldChangeType.ADD) {
                    // increase the counter that tracks new relationships
                    this.nbAddedFields$.next(this.nbAddedFields$.getValue() + 1);
                    if (this.isLastPage$.getValue() === true) {
                      // only include newly added relationships to the output if we're on the last
                      // page
                      fieldUpdatesFiltered[uuid] = fieldUpdates[uuid];
                    }
                  } else {
                    // include all others
                    fieldUpdatesFiltered[uuid] = fieldUpdates[uuid];
                  }
                }
              }
            });
            return fieldUpdatesFiltered;
          }),
        );
      }),
      startWith({}),
    ).subscribe((updates: FieldUpdates) => {
      this.loading$.next(false);
      this.updates$.next(updates);
    }));
  }

  ngOnDestroy(): void {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }
}
