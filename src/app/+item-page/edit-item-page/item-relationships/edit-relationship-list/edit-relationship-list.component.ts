import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { FieldChangeType } from '../../../../core/data/object-updates/object-updates.actions';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { combineLatest as observableCombineLatest, Observable, of } from 'rxjs';
import {
  FieldUpdate,
  FieldUpdates,
  RelationshipIdentifiable
} from '../../../../core/data/object-updates/object-updates.reducer';
import { RelationshipService } from '../../../../core/data/relationship.service';
import { Item } from '../../../../core/shared/item.model';
import { defaultIfEmpty, map, mergeMap, switchMap, take, } from 'rxjs/operators';
import { hasValue, hasValueOperator } from '../../../../shared/empty.util';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { RelationshipType } from '../../../../core/shared/item-relationships/relationship-type.model';
import {
  getAllSucceededRemoteData,
  getRemoteDataPayload,
  getFirstSucceededRemoteData,
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

@Component({
  selector: 'ds-edit-relationship-list',
  styleUrls: ['./edit-relationship-list.component.scss'],
  templateUrl: './edit-relationship-list.component.html',
})
/**
 * A component creating a list of editable relationships of a certain type
 * The relationships are rendered as a list of related items
 */
export class EditRelationshipListComponent implements OnInit {

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

  private relatedEntityType$: Observable<ItemType>;

  /**
   * The list ID to save selected entities under
   */
  listId: string;

  /**
   * The FieldUpdates for the relationships in question
   */
  updates$: Observable<FieldUpdates>;

  /**
   * A reference to the lookup window
   */
  modalRef: NgbModalRef;

  constructor(
    protected objectUpdatesService: ObjectUpdatesService,
    protected linkService: LinkService,
    protected relationshipService: RelationshipService,
    protected modalService: NgbModal,
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
                  return of(field.relatedItem);
                }
              })
          ) : of([])
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

    this.relatedEntityType$ =
      observableCombineLatest([
        this.relationshipType.leftType,
        this.relationshipType.rightType,
      ].map((type) => type.pipe(
        getFirstSucceededRemoteData(),
        getRemoteDataPayload(),
      ))).pipe(
        map((relatedTypes: ItemType[]) => relatedTypes.find((relatedType) => relatedType.uuid !== this.itemType.uuid)),
        hasValueOperator()
      );

    this.relatedEntityType$.pipe(
      take(1)
    ).subscribe(
      (relatedEntityType) => this.listId = `edit-relationship-${this.itemType.id}-${relatedEntityType.id}`
    );

    this.updates$ = this.getItemRelationships().pipe(
      switchMap((relationships) =>
        observableCombineLatest(
          relationships.map((relationship) => this.relationshipService.isLeftItem(relationship, this.item))
        ).pipe(
          defaultIfEmpty([]),
          map((isLeftItemArray) => isLeftItemArray.map((isLeftItem, index) => {
            const relationship = relationships[index];
            const nameVariant = isLeftItem ? relationship.rightwardValue : relationship.leftwardValue;
            return {
              uuid: relationship.id,
              type: this.relationshipType,
              relationship,
              nameVariant,
            } as RelationshipIdentifiable;
          })),
        )),
      switchMap((initialFields) => this.objectUpdatesService.getFieldUpdates(this.url, initialFields).pipe(
        map((fieldUpdates) => {
          const fieldUpdatesFiltered: FieldUpdates = {};
          Object.keys(fieldUpdates).forEach((uuid) => {
            if (hasValue(fieldUpdates[uuid])) {
              const field = fieldUpdates[uuid].field;
              if ((field as RelationshipIdentifiable).type.id === this.relationshipType.id) {
                fieldUpdatesFiltered[uuid] = fieldUpdates[uuid];
              }
            }
          });
          return fieldUpdatesFiltered;
        }),
      )),
    );
  }

  private getItemRelationships() {
    this.linkService.resolveLink(this.item,
      followLink('relationships', undefined, true,
        followLink('relationshipType'),
        followLink('leftItem'),
        followLink('rightItem'),
      ));
    return this.item.relationships.pipe(
      getAllSucceededRemoteData(),
      map((relationships: RemoteData<PaginatedList<Relationship>>) => relationships.payload.page.filter((relationship: Relationship) => hasValue(relationship))),
      switchMap((itemRelationships: Relationship[]) =>
        observableCombineLatest(
          itemRelationships
            .map((relationship) => relationship.relationshipType.pipe(
              getFirstSucceededRemoteData(),
              getRemoteDataPayload(),
            ))
        ).pipe(
          defaultIfEmpty([]),
          map((relationshipTypes) => itemRelationships.filter(
            (relationship, index) => relationshipTypes[index].id === this.relationshipType.id)
          ),
        )
      ),
    );
  }
}
