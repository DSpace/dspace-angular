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
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { hasValue, isNotEmpty, isNotEmptyOperator } from '../../../shared/empty.util';
import { zip as observableZip, combineLatest as observableCombineLatest, of as observableOf } from 'rxjs';
import { ErrorResponse, RestResponse } from '../../../core/cache/response.models';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { RequestService } from '../../../core/data/request.service';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../core/shared/operators';
import { Item } from '../../../core/shared/item.model';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { Bundle } from '../../../core/shared/bundle.model';
import { FieldUpdate, FieldUpdates } from '../../../core/data/object-updates/object-updates.reducer';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { FieldChangeType } from '../../../core/data/object-updates/object-updates.actions';
import { Operation } from 'fast-json-patch';
import { MoveOperation } from 'fast-json-patch/lib/core';
import { BundleDataService } from '../../../core/data/bundle-data.service';
import { PaginatedSearchOptions } from '../../../shared/search/paginated-search-options.model';
import { ResponsiveColumnSizes } from '../../../shared/responsive-table-sizes/responsive-column-sizes';
import { ResponsiveTableSizes } from '../../../shared/responsive-table-sizes/responsive-table-sizes';

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
   * The page options to use for fetching the bundles
   */
  bundlesOptions = {
    id: 'bundles-pagination-options',
    currentPage: 1,
    pageSize: 9999
  } as any;

  /**
   * The bootstrap sizes used for the columns within this table
   */
  columnSizes = new ResponsiveTableSizes([
    // Name column
    new ResponsiveColumnSizes(2, 2, 3, 4, 4),
    // Description column
    new ResponsiveColumnSizes(2, 3, 3, 3, 3),
    // Format column
    new ResponsiveColumnSizes(2, 2, 2, 2, 2),
    // Actions column
    new ResponsiveColumnSizes(6, 5, 4, 3, 3)
  ]);

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
    public bundleService: BundleDataService
  ) {
    super(itemService, objectUpdatesService, router, notificationsService, translateService, route);
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
    this.bundles$ = this.itemService.getBundles(this.item.id, new PaginatedSearchOptions({pagination: this.bundlesOptions})).pipe(
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
        this.postItemInit();
        this.initializeOriginalFields();
        this.initializeUpdates();
        this.cdRef.detectChanges();
      }
    });
  }

  /**
   * Submit the current changes
   * Bitstreams that were dragged around send out a patch request with move operations to the rest API
   * Bitstreams marked as deleted send out a delete request to the rest API
   * Display notifications and reset the current item/updates
   */
  submit() {
    this.submitting = true;
    const bundlesOnce$ = this.bundles$.pipe(take(1));

    // Fetch all move operations for each bundle
    const moveOperations$ = bundlesOnce$.pipe(
      switchMap((bundles: Bundle[]) => observableZip(...bundles.map((bundle: Bundle) =>
        this.objectUpdatesService.getMoveOperations(bundle.self).pipe(
          take(1),
          map((operations: MoveOperation[]) => [...operations.map((operation: MoveOperation) => Object.assign(operation, {
            from: `/_links/bitstreams${operation.from}/href`,
            path: `/_links/bitstreams${operation.path}/href`
          }))])
        )
      )))
    );

    // Send out an immediate patch request for each bundle
    const patchResponses$ = observableCombineLatest(bundlesOnce$, moveOperations$).pipe(
      switchMap(([bundles, moveOperationList]: [Bundle[], Operation[][]]) =>
        observableZip(...bundles.map((bundle: Bundle, index: number) => {
          if (isNotEmpty(moveOperationList[index])) {
            return this.bundleService.patch(bundle, moveOperationList[index]);
          } else {
            return observableOf(undefined);
          }
        }))
      )
    );

    // Fetch all removed bitstreams from the object update service
    const removedBitstreams$ = bundlesOnce$.pipe(
      switchMap((bundles: Bundle[]) => observableZip(
        ...bundles.map((bundle: Bundle) => this.objectUpdatesService.getFieldUpdates(bundle.self, [], true))
      )),
      map((fieldUpdates: FieldUpdates[]) => ([] as FieldUpdate[]).concat(
        ...fieldUpdates.map((updates: FieldUpdates) => Object.values(updates).filter((fieldUpdate: FieldUpdate) => fieldUpdate.changeType === FieldChangeType.REMOVE))
      )),
      map((fieldUpdates: FieldUpdate[]) => fieldUpdates.map((fieldUpdate: FieldUpdate) => fieldUpdate.field))
    );

    // Send out delete requests for all deleted bitstreams
    const removedResponses$ = removedBitstreams$.pipe(
      take(1),
      switchMap((removedBistreams: Bitstream[]) => {
        if (isNotEmpty(removedBistreams)) {
          return observableZip(...removedBistreams.map((bitstream: Bitstream) => this.bitstreamService.deleteAndReturnResponse(bitstream.id)));
        } else {
          return observableOf(undefined);
        }
      })
    );

    // Perform the setup actions from above in order and display notifications
    patchResponses$.pipe(
      switchMap((responses: RestResponse[]) => {
        this.displayNotifications('item.edit.bitstreams.notifications.move', responses);
        return removedResponses$
      }),
      take(1)
    ).subscribe((responses: RestResponse[]) => {
      this.displayNotifications('item.edit.bitstreams.notifications.remove', responses);
      this.reset();
      this.submitting = false;
    });
  }

  /**
   * Display notifications
   * - Error notification for each failed response with their message
   * - Success notification in case there's at least one successful response
   * @param key       The i18n key for the notification messages
   * @param responses The returned responses to display notifications for
   */
  displayNotifications(key: string, responses: RestResponse[]) {
    if (isNotEmpty(responses)) {
      const failedResponses = responses.filter((response: RestResponse) => hasValue(response) && !response.isSuccessful);
      const successfulResponses = responses.filter((response: RestResponse) => hasValue(response) && response.isSuccessful);

      failedResponses.forEach((response: ErrorResponse) => {
        this.notificationsService.error(this.translateService.instant(`${key}.failed.title`), response.errorMessage);
      });
      if (successfulResponses.length > 0) {
        this.notificationsService.success(this.translateService.instant(`${key}.saved.title`), this.translateService.instant(`${key}.saved.content`));
      }
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
    this.bundles$.pipe(take(1)).subscribe((bundles: Bundle[]) => {
      bundles.forEach((bundle: Bundle) => {
        this.objectCache.remove(bundle.self);
        this.requestService.removeByHrefSubstring(bundle.self);
      });
      this.objectCache.remove(this.item.self);
      this.requestService.removeByHrefSubstring(this.item.self);
    });
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
