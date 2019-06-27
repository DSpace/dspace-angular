import { ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { FieldUpdate, FieldUpdates } from '../../../core/data/object-updates/object-updates.reducer';
import { Observable } from 'rxjs/internal/Observable';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
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
import { ErrorResponse, RestResponse } from '../../../core/cache/response.models';
import { isNotEmptyOperator } from '../../../shared/empty.util';
import { RemoteData } from '../../../core/data/remote-data';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { getSucceededRemoteData } from '../../../core/shared/operators';
import { RequestService } from '../../../core/data/request.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { getRelationsByRelatedItemIds } from '../../simple/item-types/shared/item-relationships-utils';

@Component({
  selector: 'ds-item-relationships',
  styleUrls: ['./item-relationships.component.scss'],
  templateUrl: './item-relationships.component.html',
})
/**
 * Component for displaying an item's relationships edit page
 */
export class ItemRelationshipsComponent extends AbstractItemUpdateComponent implements OnDestroy {

  /**
   * The labels of all different relations within this item
   */
  relationLabels$: Observable<string[]>;

  /**
   * A subscription that checks when the item is deleted in cache and reloads the item by sending a new request
   * This is used to update the item in cache after relationships are deleted
   */
  itemUpdateSubscription: Subscription;

  constructor(
    protected itemService: ItemDataService,
    protected objectUpdatesService: ObjectUpdatesService,
    protected router: Router,
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService,
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    protected route: ActivatedRoute,
    protected relationshipService: RelationshipService,
    protected objectCache: ObjectCacheService,
    protected requestService: RequestService,
    protected cdRef: ChangeDetectorRef
  ) {
    super(itemService, objectUpdatesService, router, notificationsService, translateService, EnvConfig, route);
  }

  /**
   * Set up and initialize all fields
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.relationLabels$ = this.relationshipService.getItemRelationshipLabels(this.item);
    this.initializeItemUpdate();
  }

  /**
   * Update the item (and view) when it's removed in the request cache
   */
  public initializeItemUpdate(): void {
    this.itemUpdateSubscription = this.requestService.hasByHrefObservable(this.item.self).pipe(
      filter((exists: boolean) => !exists),
      switchMap(() => this.itemService.findById(this.item.uuid)),
      getSucceededRemoteData(),
    ).subscribe((itemRD: RemoteData<Item>) => {
      this.item = itemRD.payload;
      this.cdRef.detectChanges();
    });
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
   * Resolve the currently selected related items back to relationships and send a delete request for each of the relationships found
   * Make sure the lists are refreshed afterwards and notifications are sent for success and errors
   */
  public submit(): void {
    // Get all IDs of related items of which their relationship with the current item is about to be removed
    const removedItemIds$ = this.relationshipService.getRelatedItems(this.item).pipe(
      switchMap((items: Item[]) => this.objectUpdatesService.getFieldUpdatesExclusive(this.url, items) as Observable<FieldUpdates>),
      map((fieldUpdates: FieldUpdates) => Object.values(fieldUpdates).filter((fieldUpdate: FieldUpdate) => fieldUpdate.changeType === FieldChangeType.REMOVE)),
      map((fieldUpdates: FieldUpdate[]) => fieldUpdates.map((fieldUpdate: FieldUpdate) => fieldUpdate.field.uuid) as string[]),
      isNotEmptyOperator()
    );
    // Get all the relationships that should be removed
    const removedRelationships$ = removedItemIds$.pipe(
      getRelationsByRelatedItemIds(this.item, this.relationshipService)
    );
    // Request a delete for every relationship found in the observable created above
    removedRelationships$.pipe(
      take(1),
      map((removedRelationships: Relationship[]) => removedRelationships.map((rel: Relationship) => rel.id)),
      switchMap((removedIds: string[]) => observableZip(...removedIds.map((uuid: string) => this.relationshipService.deleteRelationship(uuid))))
    ).subscribe((responses: RestResponse[]) => {
      this.displayNotifications(responses);
      this.reset();
    });
  }

  /**
   * Display notifications
   * - Error notification for each failed response with their message
   * - Success notification in case there's at least one successful response
   * @param responses
   */
  displayNotifications(responses: RestResponse[]) {
    const failedResponses = responses.filter((response: RestResponse) => !response.isSuccessful);
    const successfulResponses = responses.filter((response: RestResponse) => response.isSuccessful);

    failedResponses.forEach((response: ErrorResponse) => {
      this.notificationsService.error(this.getNotificationTitle('failed'), response.errorMessage);
    });
    if (successfulResponses.length > 0) {
      // Remove the item's cache to make sure the lists are reloaded with the newest values
      this.objectCache.remove(this.item.self);
      this.requestService.removeByHrefSubstring(this.item.self);
      // Send a notification that the removal was successful
      this.notificationsService.success(this.getNotificationTitle('saved'), this.getNotificationContent('saved'));
    }
  }

  /**
   * Re-initialize fields and subscriptions
   */
  reset() {
    this.initializeOriginalFields();
    this.initializeUpdates();
    this.initializeItemUpdate();
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
   * Unsubscribe from the item update when the component is destroyed
   */
  ngOnDestroy(): void {
    this.itemUpdateSubscription.unsubscribe();
  }

}
