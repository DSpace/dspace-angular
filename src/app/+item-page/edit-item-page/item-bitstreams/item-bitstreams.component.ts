import { ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { AbstractItemUpdateComponent } from '../abstract-item-update/abstract-item-update.component';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { toBitstreamsArray, toBundleMap } from '../../../core/shared/item-bitstreams-utils';
import { Observable } from 'rxjs/internal/Observable';
import { FieldUpdate, FieldUpdates } from '../../../core/data/object-updates/object-updates.reducer';
import { Subscription } from 'rxjs/internal/Subscription';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../../config';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { FieldChangeType } from '../../../core/data/object-updates/object-updates.actions';
import { isNotEmptyOperator } from '../../../shared/empty.util';
import { zip as observableZip } from 'rxjs';
import { ErrorResponse, RestResponse } from '../../../core/cache/response.models';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { RequestService } from '../../../core/data/request.service';
import { getSucceededRemoteData } from '../../../core/shared/operators';
import { Item } from '../../../core/shared/item.model';
import { RemoteData } from '../../../core/data/remote-data';

export const ORIGINAL_BUNDLE = 'ORIGINAL';

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
   * A Map of the current item's bundles and respective FieldUpdates
   * key:   Bundle Name
   * value: FieldUpdates about the bundle's bitstreams
   */
  updatesMap: Map<string, Observable<FieldUpdates>>;

  /**
   * A subscription keeping the updatesMap up-to-date
   */
  updatesMapSub: Subscription;

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
   * Initialize the notification messages prefix
   */
  initializeNotificationsPrefix(): void {
    this.notificationsPrefix = 'item.edit.bitstreams.notifications.';
  }

  /**
   * Initialize the original fields for the object-updates-service
   */
  initializeOriginalFields(): void {
    this.item.bitstreams.pipe(
      toBitstreamsArray(),
      take(1)
    ).subscribe((bitstreams: Bitstream[]) => {
      this.objectUpdatesService.initialize(this.url, bitstreams, this.item.lastModified);
    });
  }

  /**
   * Initialize field updates
   */
  initializeUpdates(): void {
    this.updates$ = this.item.bitstreams.pipe(
      toBitstreamsArray(),
      switchMap((bitstreams: Bitstream[]) => this.objectUpdatesService.getFieldUpdates(this.url, bitstreams))
    );
    this.updatesMapSub = this.item.bitstreams.pipe(
      toBundleMap()
    ).subscribe((bundleMap: Map<string, Bitstream[]>) => {
      const updatesMap = new Map();
      bundleMap.forEach((bitstreams: Bitstream[], bundleName: string) => {
        updatesMap.set(bundleName, this.objectUpdatesService.getFieldUpdatesExclusive(this.url, bitstreams));
      });
      if (updatesMap.size === 0) {
        // Add an ORIGINAL bundle by default if the item doesn't contain any bitstreams
        updatesMap.set(ORIGINAL_BUNDLE, undefined);
      }
      this.updatesMap = updatesMap;
    });
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
      this.item = itemRD.payload;
      this.initializeOriginalFields();
      this.initializeUpdates();
      this.cdRef.detectChanges();
    });
  }

  /**
   * Submit the current changes
   * Bitstreams marked as deleted send out a delete request to the rest API
   * Display notifications and reset the current item/updates
   */
  submit() {
    const removedBitstreams$ = this.item.bitstreams.pipe(
      toBitstreamsArray(),
      switchMap((bitstreams: Bitstream[]) => this.objectUpdatesService.getFieldUpdatesExclusive(this.url, bitstreams) as Observable<FieldUpdates>),
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
   * De-cache the current item (it should automatically reload due to itemUpdateSubscription)
   */
  reset() {
    this.updatesMap = undefined;
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
    this.updatesMapSub.unsubscribe();
    this.itemUpdateSubscription.unsubscribe();
  }
}
