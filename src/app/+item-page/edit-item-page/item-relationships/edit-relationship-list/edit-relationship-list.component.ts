import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { FieldChangeType } from '../../../../core/data/object-updates/object-updates.actions';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import {
  combineLatest as observableCombineLatest,
  Observable,
  of as observableOf,
  from as observableFrom
} from 'rxjs';
import {
  FieldUpdate,
  FieldUpdates,
  RelationshipIdentifiable
} from '../../../../core/data/object-updates/object-updates.reducer';
import { RelationshipService } from '../../../../core/data/relationship.service';
import { Item } from '../../../../core/shared/item.model';
import {
  defaultIfEmpty,
  map,
  mergeMap,
  switchMap,
  take,
  startWith,
  toArray,
  tap
} from 'rxjs/operators';
import { hasValue, hasValueOperator, hasNoValue } from '../../../../shared/empty.util';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { RelationshipType } from '../../../../core/shared/item-relationships/relationship-type.model';
import {
  getRemoteDataPayload,
  getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload,
  getAllSucceededRemoteData,
} from '../../../../core/shared/operators';
import { ItemType } from '../../../../core/shared/item-relationships/item-type.model';
import { DsDynamicLookupRelationModalComponent } from '../../../../shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/dynamic-lookup-relation-modal.component';
import { RelationshipOptions } from '../../../../shared/form/builder/models/relationship-options.model';
import { ItemSearchResult } from '../../../../shared/object-collection/shared/item-search-result.model';
import { SelectableListService } from '../../../../shared/object-list/selectable-list/selectable-list.service';
import { SearchResult } from '../../../../shared/search/search-result.model';
import { followLink } from '../../../../shared/utils/follow-link-config.model';
import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Collection } from '../../../../core/shared/collection.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subscription } from 'rxjs/internal/Subscription';
import { PaginationComponentOptions } from '../../../../shared/pagination/pagination-component-options.model';
import { PaginationService } from '../../../../core/pagination/pagination.service';

@Component({
  selector: 'ds-edit-relationship-list',
  styleUrls: ['./edit-relationship-list.component.scss'],
  templateUrl: './edit-relationship-list.component.html',
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
   * Observable that emits the left and right item type of {@link relationshipType} simultaneously.
   */
  private relationshipLeftAndRightType$: Observable<[ItemType, ItemType]>;

  /**
   * Observable that emits true if {@link itemType} is on the left-hand side of {@link relationshipType},
   * false if it is on the right-hand side and undefined in the rare case that it is on neither side.
   */
  private currentItemIsLeftItem$: Observable<boolean>;

  private relatedEntityType$: Observable<ItemType>;

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

  constructor(
    protected objectUpdatesService: ObjectUpdatesService,
    protected linkService: LinkService,
    protected relationshipService: RelationshipService,
    protected modalService: NgbModal,
    protected paginationService: PaginationService,
    protected selectableListService: SelectableListService,
  ) {
  }

  /**
   * Get the i18n message key for this relationship type
   */
  public getRelationshipMessageKey(): Observable<string> {

    return observableCombineLatest(
      this.getLabel(),
      this.relatedEntityType$,
    ).pipe(
      map(([label, relatedEntityType]) => {
        if (hasValue(label) && label.indexOf('is') > -1 && label.indexOf('Of') > -1) {
          const relationshipLabel = `${label.substring(2, label.indexOf('Of'))}`;
          if (relationshipLabel !== relatedEntityType.label) {
            return `relationships.is${relationshipLabel}Of.${relatedEntityType.label}`;
          } else {
            return `relationships.is${relationshipLabel}Of`;
          }
        } else {
          return label;
        }
      }),
    );
  }

  /**
   * Get the relevant label for this relationship type
   */
  private getLabel(): Observable<string> {
    return observableCombineLatest([
      this.relationshipType.leftType,
      this.relationshipType.rightType,
    ].map((itemTypeRD) => itemTypeRD.pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
    ))).pipe(
      map((itemTypes: ItemType[]) => [
        this.relationshipType.leftwardType,
        this.relationshipType.rightwardType,
      ][itemTypes.findIndex((itemType) => itemType.id === this.itemType.id)]),
    );
  }

  /**
   * Prevent unnecessary rerendering so fields don't lose focus
   */
  trackUpdate(index, update: FieldUpdate) {
    return update && update.field ? update.field.uuid : undefined;
  }

  /**
   * Open the dynamic lookup modal to search for items to add as relationships
   */
  openLookup() {

    this.modalRef = this.modalService.open(DsDynamicLookupRelationModalComponent, {
      size: 'lg'
    });
    const modalComp: DsDynamicLookupRelationModalComponent = this.modalRef.componentInstance;
    modalComp.repeatable = true;
    modalComp.listId = this.listId;
    modalComp.item = this.item;
    this.item.owningCollection.pipe(
      getFirstSucceededRemoteDataPayload()
    ).subscribe((collection: Collection) => {
      modalComp.collection = collection;
    });
    modalComp.select = (...selectableObjects: SearchResult<Item>[]) => {
      selectableObjects.forEach((searchResult) => {
        const relatedItem: Item = searchResult.indexableObject;
        this.getFieldUpdatesForRelatedItem(relatedItem)
          .subscribe((identifiables) => {
            identifiables.forEach((identifiable) =>
              this.objectUpdatesService.removeSingleFieldUpdate(this.url, identifiable.uuid)
            );
            if (identifiables.length === 0) {
              this.relationshipService.getNameVariant(this.listId, relatedItem.uuid)
                .subscribe((nameVariant) => {
                  const update = {
                    uuid: this.relationshipType.id + '-' + relatedItem.uuid,
                    nameVariant,
                    type: this.relationshipType,
                    relatedItem,
                  } as RelationshipIdentifiable;
                  this.objectUpdatesService.saveAddFieldUpdate(this.url, update);
                });
            }

            this.loading$.next(true);
            // emit the last page again to trigger a fieldupdates refresh
            this.relationshipsRd$.next(this.relationshipsRd$.getValue());
          });
      });
    };
    modalComp.deselect = (...selectableObjects: SearchResult<Item>[]) => {
      selectableObjects.forEach((searchResult) => {
        const relatedItem: Item = searchResult.indexableObject;
        this.objectUpdatesService.removeSingleFieldUpdate(this.url, this.relationshipType.id + '-' + relatedItem.uuid);
        this.getFieldUpdatesForRelatedItem(relatedItem)
          .subscribe((identifiables) =>
            identifiables.forEach((identifiable) =>
              this.objectUpdatesService.saveRemoveFieldUpdate(this.url, identifiable)
            )
          );
      });

      this.loading$.next(true);
      // emit the last page again to trigger a fieldupdates refresh
      this.relationshipsRd$.next(this.relationshipsRd$.getValue());
    };
    this.relatedEntityType$
      .pipe(take(1))
      .subscribe((relatedEntityType) => {
        modalComp.relationshipOptions = Object.assign(
          new RelationshipOptions(), {
            relationshipType: relatedEntityType.label,
            // filter: this.getRelationshipMessageKey(),
            searchConfiguration: relatedEntityType.label.toLowerCase(),
            nameVariants: true,
          }
        );
      });

    this.selectableListService.deselectAll(this.listId);
    this.updates$.pipe(
      switchMap((updates) =>
        Object.values(updates).length > 0 ?
          observableCombineLatest(
            Object.values(updates)
              .filter((update) => update.changeType !== FieldChangeType.REMOVE)
              .map((update) => {
                const field = update.field as RelationshipIdentifiable;
                if (field.relationship) {
                  return this.getRelatedItem(field.relationship);
                } else {
                  return observableOf(field.relatedItem);
                }
              })
          ) : observableOf([])
      ),
      take(1),
      map((items) => items.map((item) => {
        const searchResult = new ItemSearchResult();
        searchResult.indexableObject = item;
        searchResult.hitHighlights = {};
        return searchResult;
      })),
    ).subscribe((items) => {
      this.selectableListService.select(this.listId, items);
    });
  }

  /**
   * Get the existing field updates regarding a relationship with a given item
   * @param relatedItem The item for which to get the existing field updates
   */
  private getFieldUpdatesForRelatedItem(relatedItem: Item): Observable<RelationshipIdentifiable[]> {

    return this.updates$.pipe(
      take(1),
      map((updates) => Object.values(updates)
        .map((update) => update.field as RelationshipIdentifiable)
        .filter((field) => field.relationship)
      ),
      mergeMap((identifiables) =>
        observableCombineLatest(
          identifiables.map((identifiable) => this.getRelatedItem(identifiable.relationship))
        ).pipe(
          defaultIfEmpty([]),
          map((relatedItems) =>
            identifiables.filter((identifiable, index) => relatedItems[index].uuid === relatedItem.uuid)
          ),
        )
      ),
    );
  }

  /**
   * Get the related item for a given relationship
   * @param relationship  The relationship for which to get the related item
   */
  private getRelatedItem(relationship: Relationship): Observable<Item> {
    return this.relationshipService.isLeftItem(relationship, this.item).pipe(
      switchMap((isLeftItem) => isLeftItem ? relationship.rightItem : relationship.leftItem),
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
    ) as Observable<Item>;
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
      map((relatedTypes: ItemType[]) => relatedTypes.find((relatedType) => relatedType.uuid !== this.itemType.uuid)),
      hasValueOperator()
    );

    this.relatedEntityType$.pipe(
      take(1)
    ).subscribe(
      (relatedEntityType) => this.listId = `edit-relationship-${this.itemType.id}-${relatedEntityType.id}`
    );

    this.currentItemIsLeftItem$ = this.relationshipLeftAndRightType$.pipe(
      map(([leftType, rightType]: [ItemType, ItemType]) => {
        if (leftType.id === this.itemType.id) {
          return true;
        }

        if (rightType.id === this.itemType.id) {
          return false;
        }

        // should never happen...
        console.warn(`The item ${this.item.uuid} is not on the right or the left side of relationship type ${this.relationshipType.uuid}`);
        return undefined;
      })
    );

    // initialize the pagination options
    this.paginationConfig = new PaginationComponentOptions();
    this.paginationConfig.id = `er${this.relationshipType.id}`;
    this.paginationConfig.pageSize = 5;
    this.paginationConfig.currentPage = 1;

    // get the pagination params from the route
    const currentPagination$ = this.paginationService.getCurrentPagination(
      this.paginationConfig.id,
      this.paginationConfig
    ).pipe(
      tap(() => this.loading$.next(true))
    );

    this.subs.push(
      observableCombineLatest([
        currentPagination$,
        this.currentItemIsLeftItem$,
      ]).pipe(
        switchMap(([currentPagination, currentItemIsLeftItem]: [PaginationComponentOptions, boolean]) =>
          // get the relationships for the current item, relationshiptype and page
          this.relationshipService.getItemRelationshipsByLabel(
            this.item,
            currentItemIsLeftItem ? this.relationshipType.leftwardType : this.relationshipType.rightwardType,
            {
              elementsPerPage: currentPagination.pageSize,
              currentPage: currentPagination.currentPage,
            },
            false,
            true,
            followLink('leftItem'),
            followLink('rightItem'),
          )),
      ).subscribe((rd: RemoteData<PaginatedList<Relationship>>) => {
        this.relationshipsRd$.next(rd);
      })
    );

    // keep isLastPage$ up to date based on relationshipsRd$
    this.subs.push(this.relationshipsRd$.pipe(
      hasValueOperator(),
      getAllSucceededRemoteData()
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
              map((isLeftItem: boolean) => [relationship, isLeftItem])
            )
          ),
          map(([relationship, isLeftItem]: [Relationship, boolean]) => {
            // turn it into a RelationshipIdentifiable, an
            const nameVariant =
              isLeftItem ? relationship.rightwardValue : relationship.leftwardValue;
            return {
              uuid: relationship.id,
              type: this.relationshipType,
              relationship,
              nameVariant,
            } as RelationshipIdentifiable;
          }),
          // wait until all relationships have been processed, and emit them all as a single array
          toArray(),
          // if the pipe above completes without emitting anything, emit an empty array instead
          defaultIfEmpty([])
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
