import { ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { AbstractItemUpdateComponent } from '../abstract-item-update/abstract-item-update.component';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../../config';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { hasValue } from '../../../shared/empty.util';
import { zip as observableZip } from 'rxjs';
import { ErrorResponse, RestResponse } from '../../../core/cache/response.models';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { RequestService } from '../../../core/data/request.service';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../core/shared/operators';
import { Item } from '../../../core/shared/item.model';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { Bundle } from '../../../core/shared/bundle.model';

@Component({
  selector: 'ds-item-bitstreams',
  styleUrls: ['./item-bitstreams.component.scss'],
  templateUrl: './item-bitstreams.component.html',
})
/**
 * Component for displaying an item's bitstreams edit page
 */
export class ItemBitstreamsComponent extends AbstractItemUpdateComponent implements OnDestroy {

  /**
   * The currently listed bundles
   */
  bundles$: Observable<Bundle[]>;

  /**
   * A subscription that checks when the item is deleted in cache and reloads the item by sending a new request
   * This is used to update the item in cache after bitstreams are deleted
   */
  itemUpdateSubscription: Subscription;

  constructor(
    public itemService: ItemDataService,
    public objectUpdatesService: ObjectUpdatesService,
    public router: Router,
    public notificationsService: NotificationsService,
    public translateService: TranslateService,
    @Inject(GLOBAL_CONFIG) public EnvConfig: GlobalConfig,
    public route: ActivatedRoute,
    public bitstreamService: BitstreamDataService,
    public objectCache: ObjectCacheService,
    public requestService: RequestService,
    public cdRef: ChangeDetectorRef
  ) {
    super(itemService, objectUpdatesService, router, notificationsService, translateService, EnvConfig, route);
  }

  /**
   * Set up and initialize all fields
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.initializeItemUpdate();
  }

  /**
   * Actions to perform after the item has been initialized
   */
  postItemInit(): void {
    this.bundles$ = this.item.bundles.pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
      map((bundlePage: PaginatedList<Bundle>) => bundlePage.page)
    );
  }

  /**
   * Initialize the notification messages prefix
   */
  initializeNotificationsPrefix(): void {
    this.notificationsPrefix = 'item.edit.bitstreams.notifications.';
  }

  /**
   * Initialize the original fields for the object-updates-service
   */
  initializeOriginalFields(): void {
    this.objectUpdatesService.initialize(this.url, [], this.item.lastModified);
  }

  /**
   * Update the item (and view) when it's removed in the request cache
   * Also re-initialize the original fields and updates
   */
  initializeItemUpdate(): void {
    this.itemUpdateSubscription = this.requestService.hasByHrefObservable(this.item.self).pipe(
      filter((exists: boolean) => !exists),
      switchMap(() => this.itemService.findById(this.item.uuid)),
      getSucceededRemoteData(),
    ).subscribe((itemRD: RemoteData<Item>) => {
      if (hasValue(itemRD)) {
        this.item = itemRD.payload;
        this.initializeOriginalFields();
        this.initializeUpdates();
        this.cdRef.detectChanges();
      }
    });
  }

  /**
   * Submit the current changes
   * Bitstreams marked as deleted send out a delete request to the rest API
   * Display notifications and reset the current item/updates
   */
  submit() {
    /*
    const removedBitstreams$ = this.bitstreams$.pipe(
      toBitstreamsArray(),
      switchMap((bitstreams: Bitstream[]) => this.objectUpdatesService.getFieldUpdates(this.url, bitstreams, true) as Observable<FieldUpdates>),
      map((fieldUpdates: FieldUpdates) => Object.values(fieldUpdates).filter((fieldUpdate: FieldUpdate) => fieldUpdate.changeType === FieldChangeType.REMOVE)),
      map((fieldUpdates: FieldUpdate[]) => fieldUpdates.map((fieldUpdate: FieldUpdate) => fieldUpdate.field)),
      isNotEmptyOperator()
    );
    removedBitstreams$.pipe(
      take(1),
      switchMap((removedBistreams: Bitstream[]) => observableZip(...removedBistreams.map((bitstream: Bitstream) => this.bitstreamService.deleteAndReturnResponse(bitstream))))
    ).subscribe((responses: RestResponse[]) => {
      this.displayNotifications(responses);
      this.reset();
    });
    */
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
   * Request the object updates service to discard all current changes to this item
   * Shows a notification to remind the user that they can undo this
   */
  discard() {
    const undoNotification = this.notificationsService.info(this.getNotificationTitle('discarded'), this.getNotificationContent('discarded'), {timeOut: this.discardTimeOut});
    this.objectUpdatesService.discardAllFieldUpdates(this.url, undoNotification);
  }

  /**
   * Request the object updates service to undo discarding all changes to this item
   */
  reinstate() {
    super.reinstate();
    this.bundles$.pipe(take(1)).subscribe((bundles: Bundle[]) => {
      bundles.forEach((bundle: Bundle) => {
        this.objectUpdatesService.reinstateFieldUpdates(bundle.self);
      });
    });
  }

  /**
   * De-cache the current item (it should automatically reload due to itemUpdateSubscription)
   */
  reset() {
    this.refreshItemCache();
    this.initializeItemUpdate();
  }

  /**
   * Remove the current item's cache from object- and request-cache
   */
  refreshItemCache() {
    this.objectCache.remove(this.item.self);
    this.requestService.removeByHrefSubstring(this.item.self);
  }

  /**
   * Unsubscribe from open subscriptions whenever the component gets destroyed
   */
  ngOnDestroy(): void {
    if (this.itemUpdateSubscription) {
      this.itemUpdateSubscription.unsubscribe();
    }
  }
}
