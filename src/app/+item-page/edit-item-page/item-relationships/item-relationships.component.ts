import { Component } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { FieldUpdates } from '../../../core/data/object-updates/object-updates.reducer';
import { Observable } from 'rxjs/internal/Observable';
import { distinctUntilChanged, first, flatMap, map, switchMap } from 'rxjs/operators';
import { zip as observableZip } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { Relationship } from '../../../core/shared/item-relationships/relationship.model';
import { hasValue, hasValueOperator } from '../../../shared/empty.util';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../core/shared/operators';
import { RelationshipType } from '../../../core/shared/item-relationships/relationship-type.model';
import {
  compareArraysUsingIds,
  filterRelationsByTypeLabel,
  relationsToItems
} from '../../simple/item-types/shared/item.component';
import { combineLatest as observableCombineLatest } from 'rxjs/internal/observable/combineLatest';
import { AbstractItemUpdateComponent } from '../abstract-item-update/abstract-item-update.component';

@Component({
  selector: 'ds-item-relationships',
  styleUrls: ['./item-relationships.component.scss'],
  templateUrl: './item-relationships.component.html',
})
/**
 * Component for displaying an item's relationships edit page
 */
export class ItemRelationshipsComponent extends AbstractItemUpdateComponent {

  /**
   * The labels of all different relations within this item
   */
  relationLabels$: Observable<string[]>;

  /**
   * Resolved relationships and types together in one observable
   */
  resolvedRelsAndTypes$: Observable<[Relationship[], RelationshipType[]]>;

  /**
   * Set up and initialize all fields
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.initRelationshipObservables();
  }

  /**
   * Initialize the item's relationship observables for easier access across the component
   */
  initRelationshipObservables() {
    const relationships$ = this.getRelationships();

    const relationshipTypes$ = relationships$.pipe(
      flatMap((rels: Relationship[]) =>
        observableZip(...rels.map((rel: Relationship) => rel.relationshipType)).pipe(
          map(([...arr]: Array<RemoteData<RelationshipType>>) => arr.map((d: RemoteData<RelationshipType>) => d.payload).filter((type) => hasValue(type)))
        )
      ),
      distinctUntilChanged(compareArraysUsingIds())
    );

    this.resolvedRelsAndTypes$ = observableCombineLatest(
      relationships$,
      relationshipTypes$
    );
    this.relationLabels$ = relationshipTypes$.pipe(
      map((types: RelationshipType[]) => Array.from(new Set(types.map((type) => type.leftLabel))))
    );
  }

  /**
   * Initialize the values and updates of the current item's relationship fields
   */
  public initializeUpdates(): void {
    this.updates$ = this.getRelationships().pipe(
      relationsToItems(this.item.id, this.itemService),
      switchMap((items: Item[]) => this.objectUpdatesService.getFieldUpdates(this.url, items))
    );
  }

  /**
   * Initialize the prefix for notification messages
   */
  public initializeNotificationsPrefix(): void {
    this.notificationsPrefix = 'item.edit.relationships.notifications.';
  }

  public submit(): void {
    const updatedItems$ = this.getRelationships().pipe(
      first(),
      relationsToItems(this.item.id, this.itemService),
      switchMap((items: Item[]) => this.objectUpdatesService.getUpdatedFields(this.url, items) as Observable<Item[]>)
    );
    // TODO: Delete relationships
  }

  /**
   * Sends all initial values of this item to the object updates service
   */
  public initializeOriginalFields() {
    this.getRelationships().pipe(
      first(),
      relationsToItems(this.item.id, this.itemService)
    ).subscribe((items: Item[]) => {
      this.objectUpdatesService.initialize(this.url, items, this.item.lastModified);
    });
  }

  /**
   * Fetch all the relationships of the item
   */
  public getRelationships(): Observable<Relationship[]> {
    return this.item.relationships.pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
      map((rels: PaginatedList<Relationship>) => rels.page),
      hasValueOperator(),
      distinctUntilChanged(compareArraysUsingIds())
    );
  }

  /**
   * Transform the item's relationships of a specific type into related items
   * @param label   The relationship type's label
   */
  public getRelatedItemsByLabel(label: string): Observable<Item[]> {
    return this.resolvedRelsAndTypes$.pipe(
      filterRelationsByTypeLabel(label),
      relationsToItems(this.item.id, this.itemService)
    );
  }

  /**
   * Get FieldUpdates for the relationships of a specific type
   * @param label   The relationship type's label
   */
  public getUpdatesByLabel(label: string): Observable<FieldUpdates> {
    return this.getRelatedItemsByLabel(label).pipe(
      switchMap((items: Item[]) => this.objectUpdatesService.getFieldUpdatesExclusive(this.url, items))
    )
  }

}
