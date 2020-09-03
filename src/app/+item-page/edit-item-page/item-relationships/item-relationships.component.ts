import { ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { DeleteRelationship, FieldUpdate, FieldUpdates } from '../../../core/data/object-updates/object-updates.reducer';
import { Observable } from 'rxjs/internal/Observable';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { of as observableOf, zip as observableZip} from 'rxjs';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import { AbstractItemUpdateComponent } from '../abstract-item-update/abstract-item-update.component';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { RelationshipService } from '../../../core/data/relationship.service';
import { ErrorResponse, RestResponse } from '../../../core/cache/response.models';
import { RemoteData } from '../../../core/data/remote-data';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../core/shared/operators';
import { RequestService } from '../../../core/data/request.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { RelationshipType } from '../../../core/shared/item-relationships/relationship-type.model';
import { ItemType } from '../../../core/shared/item-relationships/item-type.model';
import { EntityTypeService } from '../../../core/data/entity-type.service';
import { isNotEmptyOperator } from '../../../shared/empty.util';
import { FieldChangeType } from '../../../core/data/object-updates/object-updates.actions';
import { Relationship } from '../../../core/shared/item-relationships/relationship.model';

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
  relationshipTypes$: Observable<RelationshipType[]>;

  /**
   * A subscription that checks when the item is deleted in cache and reloads the item by sending a new request
   * This is used to update the item in cache after relationships are deleted
   */
  itemUpdateSubscription: Subscription;
  entityType$: Observable<ItemType>;

  constructor(
    public itemService: ItemDataService,
    public objectUpdatesService: ObjectUpdatesService,
    public router: Router,
    public notificationsService: NotificationsService,
    public translateService: TranslateService,
    public route: ActivatedRoute,
    public relationshipService: RelationshipService,
    public objectCache: ObjectCacheService,
    public requestService: RequestService,
    public entityTypeService: EntityTypeService,
    public cdr: ChangeDetectorRef,
  ) {
    super(itemService, objectUpdatesService, router, notificationsService, translateService, route);
  }

  /**
   * Set up and initialize all fields
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.itemUpdateSubscription = this.requestService.hasByHrefObservable(this.item.self).pipe(
      filter((exists: boolean) => !exists),
      switchMap(() => this.itemService.findById(this.item.uuid,
        followLink('owningCollection'),
        followLink('bundles'),
        followLink('relationships'))),
      getSucceededRemoteData(),
    ).subscribe((itemRD: RemoteData<Item>) => {
      this.item = itemRD.payload;
      this.cdr.detectChanges();
      this.initializeUpdates();
    });
  }

  /**
   * Initialize the values and updates of the current item's relationship fields
   */
  public initializeUpdates(): void {

    const label = this.item.firstMetadataValue('relationship.type');
    if (label !== undefined) {

      this.entityType$ = this.entityTypeService.getEntityTypeByLabel(label).pipe(
        getSucceededRemoteData(),
        getRemoteDataPayload(),
      );

      this.relationshipTypes$ = this.entityType$.pipe(
        switchMap((entityType) =>
          this.entityTypeService.getEntityTypeRelationships(
            entityType.id,
            followLink('leftType'),
            followLink('rightType'))
            .pipe(
              getSucceededRemoteData(),
              getRemoteDataPayload(),
              map((relationshipTypes) => relationshipTypes.page),
            )
        ),
      );
    } else {
      this.entityType$ = observableOf(undefined);
    }
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
    // Get all the relationships that should be removed
    this.relationshipService.getItemRelationshipsArray(this.item).pipe(
      map((relationships: Relationship[]) => relationships.map((relationship) =>
        Object.assign(new Relationship(), relationship, {uuid: relationship.id})
      )),
      switchMap((relationships: Relationship[]) => {
        return this.objectUpdatesService.getFieldUpdatesExclusive(this.url, relationships) as Observable<FieldUpdates>
      }),
      map((fieldUpdates: FieldUpdates) =>
        Object.values(fieldUpdates)
          .filter((fieldUpdate: FieldUpdate) => fieldUpdate.changeType === FieldChangeType.REMOVE)
          .map((fieldUpdate: FieldUpdate) => fieldUpdate.field as DeleteRelationship)
      ),
      isNotEmptyOperator(),
      take(1),
      switchMap((deleteRelationships: DeleteRelationship[]) =>
        observableZip(...deleteRelationships.map((deleteRelationship) => {
            let copyVirtualMetadata: string;
            if (deleteRelationship.keepLeftVirtualMetadata && deleteRelationship.keepRightVirtualMetadata) {
              copyVirtualMetadata = 'all';
            } else if (deleteRelationship.keepLeftVirtualMetadata) {
              copyVirtualMetadata = 'left';
            } else if (deleteRelationship.keepRightVirtualMetadata) {
              copyVirtualMetadata = 'right';
            } else {
              copyVirtualMetadata = 'none';
            }
            return this.relationshipService.deleteRelationship(deleteRelationship.uuid, copyVirtualMetadata);
          }
        ))
      ),
    ).subscribe((responses: RestResponse[]) => {
      this.itemUpdateSubscription.add(() => {
        this.displayNotifications(responses);
      });
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
      this.notificationsService.success(this.getNotificationTitle('saved'), this.getNotificationContent('saved'));
    }
  }

  /**
   * Sends all initial values of this item to the object updates service
   */
  public initializeOriginalFields() {
    const initialFields = [];
    this.objectUpdatesService.initialize(this.url, initialFields, this.item.lastModified);
  }

  /**
   * Unsubscribe from the item update when the component is destroyed
   */
  ngOnDestroy(): void {
    this.itemUpdateSubscription.unsubscribe();
  }
}
