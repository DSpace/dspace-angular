import { Component, Inject } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { FieldUpdate, FieldUpdates } from '../../../core/data/object-updates/object-updates.reducer';
import { Observable } from 'rxjs/internal/Observable';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { combineLatest as observableCombineLatest, zip as observableZip } from 'rxjs';
import { AbstractItemUpdateComponent } from '../abstract-item-update/abstract-item-update.component';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../../config';
import { RelationshipService } from '../../../core/data/relationship.service';
import { FieldChangeType } from '../../../core/data/object-updates/object-updates.actions';
import { Relationship } from '../../../core/shared/item-relationships/relationship.model';
import { RestResponse } from '../../../core/cache/response.models';
import { isNotEmptyOperator } from '../../../shared/empty.util';

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

  constructor(
    protected itemService: ItemDataService,
    protected objectUpdatesService: ObjectUpdatesService,
    protected router: Router,
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService,
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    protected route: ActivatedRoute,
    protected relationshipService: RelationshipService
  ) {
    super(itemService, objectUpdatesService, router, notificationsService, translateService, EnvConfig, route);
  }

  /**
   * Set up and initialize all fields
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.relationLabels$ = this.relationshipService.getItemRelationshipLabels(this.item);
  }

  /**
   * Initialize the values and updates of the current item's relationship fields
   */
  public initializeUpdates(): void {
    this.updates$ = this.relationshipService.getRelatedItems(this.item).pipe(
      switchMap((items: Item[]) => this.objectUpdatesService.getFieldUpdates(this.url, items))
    );
  }

  /**
   * Initialize the prefix for notification messages
   */
  public initializeNotificationsPrefix(): void {
    this.notificationsPrefix = 'item.edit.relationships.notifications.';
  }

  /**
   * Resolve the currently selected related items back to relationships and send a delete request
   * Make sure the lists are refreshed afterwards
   */
  public submit(): void {
    // Get all IDs of related items of which their relationship with the current item is about to be removed
    const removedItemIds$ = this.relationshipService.getRelatedItems(this.item).pipe(
      switchMap((items: Item[]) => this.objectUpdatesService.getFieldUpdatesExclusive(this.url, items) as Observable<FieldUpdates>),
      map((fieldUpdates: FieldUpdates) => Object.values(fieldUpdates).filter((fieldUpdate: FieldUpdate) => fieldUpdate.changeType === FieldChangeType.REMOVE)),
      map((fieldUpdates: FieldUpdate[]) => fieldUpdates.map((fieldUpdate: FieldUpdate) => fieldUpdate.field.uuid) as string[]),
      isNotEmptyOperator()
    );
    const allRelationshipsAndRemovedItemIds$ = observableCombineLatest(
      this.relationshipService.getItemRelationshipsArray(this.item),
      removedItemIds$
    );
    // Get all IDs of the relationships that should be removed
    const removedRelationshipIds$ = allRelationshipsAndRemovedItemIds$.pipe(
      map(([relationships, itemIds]) =>
        relationships
          .filter((relationship: Relationship) => itemIds.indexOf(relationship.leftId) > -1 || itemIds.indexOf(relationship.rightId) > -1)
          .map((relationship: Relationship) => relationship.id))
    );
    // Request a delete for every relationship found in the observable created above
    removedRelationshipIds$.pipe(
      take(1),
      switchMap((removedIds: string[]) => observableZip(...removedIds.map((uuid: string) => this.relationshipService.deleteRelationship(uuid)))),
      map((responses: RestResponse[]) => responses.filter((response: RestResponse) => response.isSuccessful))
    ).subscribe((responses: RestResponse[]) => {
      // Make sure the lists are up-to-date and send a notification that the removal was successful
      // TODO: Fix lists refreshing correctly
      this.initializeOriginalFields();
      this.initializeUpdates();
      this.notificationsService.success(this.getNotificationTitle('saved'), this.getNotificationContent('saved'));
    });
  }

  /**
   * Sends all initial values of this item to the object updates service
   */
  public initializeOriginalFields() {
    this.relationshipService.getRelatedItems(this.item).pipe(take(1)).subscribe((items: Item[]) => {
      this.objectUpdatesService.initialize(this.url, items, this.item.lastModified);
    });
  }

  /**
   * Transform the item's relationships of a specific type into related items
   * @param label   The relationship type's label
   */
  public getRelatedItemsByLabel(label: string): Observable<Item[]> {
    return this.relationshipService.getRelatedItemsByLabel(this.item, label);
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

  /**
   * Get the i18n message key for a relationship
   * @param label   The relationship type's label
   */
  public getRelationshipMessageKey(label: string): string {
    if (label.indexOf('Of') > -1) {
      return `relationships.${label.substring(0, label.indexOf('Of') + 2)}`
    } else {
      return label;
    }
  }

}
