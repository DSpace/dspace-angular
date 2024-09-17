import { ChangeDetectorRef, Component, NgZone, OnDestroy } from '@angular/core';
import { AbstractItemUpdateComponent } from '../abstract-item-update/abstract-item-update.component';
import { map, switchMap, take } from 'rxjs/operators';
import { Observable, Subscription, zip as observableZip } from 'rxjs';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { hasValue } from '../../../shared/empty.util';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { RequestService } from '../../../core/data/request.service';
import {
  getFirstSucceededRemoteData,
  getRemoteDataPayload,
  getFirstCompletedRemoteData
} from '../../../core/shared/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { Bundle } from '../../../core/shared/bundle.model';
import { BundleDataService } from '../../../core/data/bundle-data.service';
import { PaginatedSearchOptions } from '../../../shared/search/models/paginated-search-options.model';
import { ResponsiveTableSizes } from '../../../shared/responsive-table-sizes/responsive-table-sizes';
import { NoContent } from '../../../core/shared/NoContent.model';
import { Operation } from 'fast-json-patch';
import { ItemBitstreamsService } from './item-bitstreams.service';
import { AlertType } from '../../../shared/alert/aletr-type';

@Component({
  selector: 'ds-item-bitstreams',
  styleUrls: ['./item-bitstreams.component.scss'],
  templateUrl: './item-bitstreams.component.html',
})
/**
 * Component for displaying an item's bitstreams edit page
 */
export class ItemBitstreamsComponent extends AbstractItemUpdateComponent implements OnDestroy {

  // Declared for use in template
  protected readonly AlertType = AlertType;

  /**
   * The currently listed bundles
   */
  bundles$: Observable<Bundle[]>;

  /**
   * The bootstrap sizes used for the columns within this table
   */
  columnSizes: ResponsiveTableSizes;

  /**
   * Are we currently submitting the changes?
   * Used to disable any action buttons until the submit finishes
   */
  submitting = false;

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
    public route: ActivatedRoute,
    public bitstreamService: BitstreamDataService,
    public objectCache: ObjectCacheService,
    public requestService: RequestService,
    public cdRef: ChangeDetectorRef,
    public bundleService: BundleDataService,
    public zone: NgZone,
    public itemBitstreamsService: ItemBitstreamsService,
  ) {
    super(itemService, objectUpdatesService, router, notificationsService, translateService, route);

    this.columnSizes = this.itemBitstreamsService.getColumnSizes();
  }

  /**
   * Actions to perform after the item has been initialized
   */
  postItemInit(): void {
    const bundlesOptions = this.itemBitstreamsService.getInitialBundlesPaginationOptions();

    this. bundles$ = this.itemService.getBundles(this.item.id, new PaginatedSearchOptions({pagination: bundlesOptions})).pipe(
      getFirstSucceededRemoteData(),
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
   * Submit the current changes
   * Bitstreams marked as deleted send out a delete request to the rest API
   * Display notifications and reset the current item/updates
   */
  submit() {
    this.submitting = true;

    const removedResponses$ = this.itemBitstreamsService.removeMarkedBitstreams(this.bundles$);

    // Perform the setup actions from above in order and display notifications
    removedResponses$.subscribe((responses: RemoteData<NoContent>) => {
      this.itemBitstreamsService.displayNotifications('item.edit.bitstreams.notifications.remove', [responses]);
      this.submitting = false;
    });
  }

  /**
   * A bitstream was dropped in a new location. Send out a Move Patch request to the REST API, display notifications,
   * refresh the bundle's cache (so the lists can properly reload) and call the event's callback function (which will
   * navigate the user to the correct page)
   * @param bundle  The bundle to send patch requests to
   * @param event   The event containing the index the bitstream came from and was dropped to
   */
  dropBitstream(bundle: Bundle, event: any) {
    this.zone.runOutsideAngular(() => {
      if (hasValue(event) && hasValue(event.fromIndex) && hasValue(event.toIndex) && hasValue(event.finish)) {
        const moveOperation = {
          op: 'move',
          from: `/_links/bitstreams/${event.fromIndex}/href`,
          path: `/_links/bitstreams/${event.toIndex}/href`
        } as Operation;
        this.bundleService.patch(bundle, [moveOperation]).pipe(
          getFirstCompletedRemoteData(),
        ).subscribe((response: RemoteData<Bundle>) => {
          this.zone.run(() => {
            this.itemBitstreamsService.displayNotifications('item.edit.bitstreams.notifications.move', [response]);
            // Remove all cached requests from this bundle and call the event's callback when the requests are cleared
            this.requestService.setStaleByHrefSubstring(bundle.self).pipe(
              take(1)
            ).subscribe(() => event.finish());
          });
        });
      }
    });
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
    this.bundles$.pipe(take(1)).subscribe((bundles: Bundle[]) => {
      bundles.forEach((bundle: Bundle) => {
        this.objectUpdatesService.reinstateFieldUpdates(bundle.self);
      });
    });
  }

  /**
   * Checks whether or not the object is currently reinstatable
   */
  isReinstatable(): Observable<boolean> {
    return this.bundles$.pipe(
      switchMap((bundles: Bundle[]) => observableZip(...bundles.map((bundle: Bundle) => this.objectUpdatesService.isReinstatable(bundle.self)))),
      map((reinstatable: boolean[]) => reinstatable.includes(true))
    );
  }

  /**
   * Checks whether or not there are currently updates for this object
   */
  hasChanges(): Observable<boolean> {
    return this.bundles$.pipe(
      switchMap((bundles: Bundle[]) => observableZip(...bundles.map((bundle: Bundle) => this.objectUpdatesService.hasUpdates(bundle.self)))),
      map((hasChanges: boolean[]) => hasChanges.includes(true))
    );
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
