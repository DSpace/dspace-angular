import { Component, NgZone, OnDestroy } from '@angular/core';
import { AbstractItemUpdateComponent } from '../abstract-item-update/abstract-item-update.component';
import { filter, map, switchMap, take, distinctUntilKeyChanged } from 'rxjs/operators';
import { Observable, Subscription, zip as observableZip, of, forkJoin } from 'rxjs';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { hasValue, isNotEmpty } from '../../../shared/empty.util';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { RequestService } from '../../../core/data/request.service';
import { getAllSucceededRemoteData, getRemoteDataPayload, getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { Bundle } from '../../../core/shared/bundle.model';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { BundleDataService } from '../../../core/data/bundle-data.service';
import { ResponsiveColumnSizes } from '../../../shared/responsive-table-sizes/responsive-column-sizes';
import { ResponsiveTableSizes } from '../../../shared/responsive-table-sizes/responsive-table-sizes';
import { NoContent } from '../../../core/shared/NoContent.model';
import { Operation } from 'fast-json-patch';
import { FieldUpdate } from '../../../core/data/object-updates/field-update.model';
import { FieldUpdates } from '../../../core/data/object-updates/field-updates.model';
import { FieldChangeType } from '../../../core/data/object-updates/field-change-type.model';
import { FindListOptions } from '../../../core/data/find-list-options.model';

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
   * The URL used as the key for bundle updates in ObjectUpdatesService
   */
  bundleUpdatesUrl: string;

  /**
   * The current field updates for all bundles
   */
  bundleFieldUpdates$: Observable<FieldUpdates>;

  /**
   * The page options to use for fetching the bundles
   */
  bundlesOptions = {
    scopeID: 'bundles-pagination-options',
    currentPage: 1,
    elementsPerPage: 9999
  } as FindListOptions;

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

  subs: Subscription[] = [];

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
    public bundleService: BundleDataService,
    public zone: NgZone
  ) {
    super(itemService, objectUpdatesService, router, notificationsService, translateService, route);
  }

  /**
   * Actions to perform after the item has been initialized
   */
  postItemInit(): void {
    this.bundleUpdatesUrl = `${this.item.self}/bundles`;

    this.bundles$ = this.bundleService.findAllByItem(this.item, this.bundlesOptions).pipe(
      getAllSucceededRemoteData(),
      distinctUntilKeyChanged('timeCompleted'),
      getRemoteDataPayload(),
      map((bundlePage: PaginatedList<Bundle>) => bundlePage.page),
    );

    // Initialize the bundle field updates in the object updates service
    this.subs.push(this.bundles$.subscribe((bundles: Bundle[]) => {
      this.objectUpdatesService.initialize(this.bundleUpdatesUrl, bundles, new Date());
    }));

    // Get field updates for bundles to track their deletion state
    this.bundleFieldUpdates$ = this.bundles$.pipe(
      switchMap((bundles: Bundle[]) => this.objectUpdatesService.getFieldUpdatesExclusive(this.bundleUpdatesUrl, bundles))
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
   * Bundles marked as deleted send out a delete request to the REST API (which also deletes their bitstreams)
   * Bitstreams marked as deleted (in non-deleted bundles) send out a delete request to the REST API
   * Display notifications and reset the current item/updates
   */
  submit() {
    this.submitting = true;
    const bundlesOnce$ = this.bundles$.pipe(take(1));

    // Get bundle field updates to determine which bundles are marked for removal
    const bundleUpdatesOnce$ = this.bundleFieldUpdates$.pipe(take(1));

    this.subs.push(forkJoin([bundlesOnce$, bundleUpdatesOnce$]).pipe(
      switchMap(([bundles, bundleUpdates]: [Bundle[], FieldUpdates]) => {
        // Separate bundles into removed and non-removed
        const removedBundles: Bundle[] = [];
        const nonRemovedBundles: Bundle[] = [];

        bundles.forEach((bundle: Bundle) => {
          const update = bundleUpdates[bundle.uuid];
          if (update?.changeType === FieldChangeType.REMOVE) {
            removedBundles.push(bundle);
          } else {
            nonRemovedBundles.push(bundle);
          }
        });

        // Get bitstreams to remove from non-removed bundles only
        const removedBitstreams$ = nonRemovedBundles.length > 0 ?
          forkJoin(nonRemovedBundles.map((bundle: Bundle) => this.objectUpdatesService.getFieldUpdates(bundle.self, [], true).pipe(take(1)))).pipe(
            map((fieldUpdates: FieldUpdates[]) => ([] as FieldUpdate[]).concat(
              ...fieldUpdates.map((updates: FieldUpdates) => Object.values(updates).filter((fieldUpdate: FieldUpdate) => fieldUpdate.changeType === FieldChangeType.REMOVE))
            )),
            map((fieldUpdates: FieldUpdate[]) => fieldUpdates.map((fieldUpdate: FieldUpdate) => fieldUpdate.field as Bitstream))
          ) : of([]);

        return removedBitstreams$.pipe(
          switchMap((removedBitstreams: Bitstream[]) => {
            const deletingBundles = removedBundles.length > 0;
            const deletingBitstreams = removedBitstreams.length > 0;
            const responses$: Observable<RemoteData<NoContent>>[] = [];

            // Delete removed bundles (this also deletes their bitstreams)
            if (deletingBundles) {
              responses$.push(this.bundleService.removeMultiple(removedBundles).pipe(
                getFirstCompletedRemoteData(),
              ));
            }

            // Delete removed bitstreams from non-removed bundles
            if (deletingBitstreams) {
              responses$.push(this.bitstreamService.removeMultiple(removedBitstreams).pipe(
                getFirstCompletedRemoteData(),
              ));
            }

            // If no changes, return a successful empty response
            if (responses$.length === 0) {
              return of({ responses: [], deletingBundles: false, deletingBitstreams: false });
            }

            return forkJoin(responses$).pipe(
              map((responses: RemoteData<NoContent>[]) => ({ responses, deletingBundles, deletingBitstreams }))
            );
          })
        );
      })
    ).subscribe(({ responses, deletingBundles, deletingBitstreams }: { responses: RemoteData<NoContent>[], deletingBundles: boolean, deletingBitstreams: boolean }) => {
      this.displayRemovalNotifications(responses, deletingBundles, deletingBitstreams);
      this.submitting = false;
    }));
  }

  /**
   * Display notifications for removal operations
   * Shows different messages based on whether bundles, bitstreams, or both were deleted
   * @param responses         The responses from the delete operations
   * @param deletingBundles   Whether bundles were deleted
   * @param deletingBitstreams Whether bitstreams were deleted
   */
  displayRemovalNotifications(responses: RemoteData<NoContent>[], deletingBundles: boolean, deletingBitstreams: boolean) {
    if (responses.length === 0) {
      return;
    }

    const failedResponses = responses.filter((response: RemoteData<NoContent>) => hasValue(response) && response.hasFailed);
    const successfulResponses = responses.filter((response: RemoteData<NoContent>) => hasValue(response) && response.hasSucceeded);

    // Determine the notification key suffix based on what was deleted
    let keySuffix: string;
    if (deletingBundles && deletingBitstreams) {
      keySuffix = 'both';
    } else if (deletingBundles) {
      keySuffix = 'bundles';
    } else {
      keySuffix = 'bitstreams';
    }

    failedResponses.forEach((response: RemoteData<NoContent>) => {
      this.notificationsService.error(
        this.translateService.instant(`item.edit.bitstreams.notifications.remove.${keySuffix}.failed.title`),
        response.errorMessage
      );
    });

    if (successfulResponses.length > 0) {
      this.notificationsService.success(
        this.translateService.instant(`item.edit.bitstreams.notifications.remove.${keySuffix}.saved.title`),
        this.translateService.instant(`item.edit.bitstreams.notifications.remove.${keySuffix}.saved.content`)
      );
    }
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
        this.bundleService.patch(bundle, [moveOperation]).pipe(take(1)).subscribe((response: RemoteData<Bundle>) => {
          this.zone.run(() => {
            this.displayNotifications('item.edit.bitstreams.notifications.move', [response]);
            // Remove all cached requests from this bundle and call the event's callback when the requests are cleared
            this.requestService.removeByHrefSubstring(bundle.self).pipe(
              filter((isCached) => isCached),
              take(1)
            ).subscribe(() => event.finish());
          });
        });
      }
    });
  }

  /**
   * Display notifications
   * - Error notification for each failed response with their message
   * - Success notification in case there's at least one successful response
   * @param key       The i18n key for the notification messages
   * @param responses The returned responses to display notifications for
   */
  displayNotifications(key: string, responses: RemoteData<any>[]) {
    if (isNotEmpty(responses)) {
      const failedResponses = responses.filter((response: RemoteData<Bundle>) => hasValue(response) && response.hasFailed);
      const successfulResponses = responses.filter((response: RemoteData<Bundle>) => hasValue(response) && response.hasSucceeded);

      failedResponses.forEach((response: RemoteData<Bundle>) => {
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
    // Discard bundle updates
    this.objectUpdatesService.discardFieldUpdates(this.bundleUpdatesUrl, undoNotification);
    // Discard bitstream updates for each bundle
    this.bundles$.pipe(take(1)).subscribe((bundles: Bundle[]) => {
      bundles.forEach((bundle: Bundle) => {
        this.objectUpdatesService.discardFieldUpdates(bundle.self, undoNotification);
      });
    });
  }

  /**
   * Request the object updates service to undo discarding all changes to this item
   */
  reinstate() {
    // Reinstate bundle updates
    this.objectUpdatesService.reinstateFieldUpdates(this.bundleUpdatesUrl);
    // Reinstate bitstream updates for each bundle
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
      switchMap((bundles: Bundle[]) => observableZip(
        this.objectUpdatesService.isReinstatable(this.bundleUpdatesUrl),
        ...bundles.map((bundle: Bundle) => this.objectUpdatesService.isReinstatable(bundle.self))
      )),
      map((reinstatable: boolean[]) => reinstatable.includes(true))
    );
  }

  /**
   * Checks whether or not there are currently updates for this object
   */
  hasChanges(): Observable<boolean> {
    return this.bundles$.pipe(
      switchMap((bundles: Bundle[]) => observableZip(
        this.objectUpdatesService.hasUpdates(this.bundleUpdatesUrl),
        ...bundles.map((bundle: Bundle) => this.objectUpdatesService.hasUpdates(bundle.self))
      )),
      map((hasChanges: boolean[]) => hasChanges.includes(true))
    );
  }

  /**
   * Unsubscribe from open subscriptions whenever the component gets destroyed
   */
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
