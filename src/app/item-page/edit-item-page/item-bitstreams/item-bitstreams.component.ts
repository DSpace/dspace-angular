import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  NgZone,
  OnDestroy,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';
import { ObjectCacheService } from '@dspace/core/cache/object-cache.service';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { BundleDataService } from '@dspace/core/data/bundle-data.service';
import { FindListOptions } from '@dspace/core/data/find-list-options.model';
import { ItemDataService } from '@dspace/core/data/item-data.service';
import { FieldUpdates } from '@dspace/core/data/object-updates/field-updates.model';
import { ObjectUpdatesService } from '@dspace/core/data/object-updates/object-updates.service';
import { PaginatedList } from '@dspace/core/data/paginated-list.model';
import { RemoteData } from '@dspace/core/data/remote-data';
import { RequestService } from '@dspace/core/data/request.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Bundle } from '@dspace/core/shared/bundle.model';
import { NoContent } from '@dspace/core/shared/NoContent.model';
import {
  getAllSucceededRemoteData,
  getRemoteDataPayload,
} from '@dspace/core/shared/operators';
import {
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Operation } from 'fast-json-patch';
import {
  combineLatest,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import {
  distinctUntilKeyChanged,
  filter,
  map,
  shareReplay,
  switchMap,
  take,
} from 'rxjs/operators';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { AlertType } from 'src/app/shared/alert/alert-type';

import { BtnDisabledDirective } from '../../../shared/btn-disabled.directive';
import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import { ResponsiveTableSizes } from '../../../shared/responsive-table-sizes/responsive-table-sizes';
import { ObjectValuesPipe } from '../../../shared/utils/object-values-pipe';
import { VarDirective } from '../../../shared/utils/var.directive';
import { AbstractItemUpdateComponent } from '../abstract-item-update/abstract-item-update.component';
import { ItemBitstreamsService } from './item-bitstreams.service';
import { ItemEditBitstreamBundleComponent } from './item-edit-bitstream-bundle/item-edit-bitstream-bundle.component';

@Component({
  selector: 'ds-item-bitstreams',
  styleUrls: ['./item-bitstreams.component.scss'],
  templateUrl: './item-bitstreams.component.html',
  imports: [
    AlertComponent,
    AsyncPipe,
    BtnDisabledDirective,
    ItemEditBitstreamBundleComponent,
    NgClass,
    RouterLink,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
  providers: [ObjectValuesPipe],
})
/**
 * Component for displaying an item's bitstreams edit page
 */
export class ItemBitstreamsComponent extends AbstractItemUpdateComponent implements OnDestroy {

  // Declared for use in template
  protected readonly AlertType = AlertType;

  /**
   * The URL used as the key for bundle updates in ObjectUpdatesService
   */
  bundleUpdatesUrl: string;

  /**
   * Emits the current bundle list; stays subscribed so cache invalidation (after delete/create) refetches the list.
   * Uses {@link BundleDataService#findAllByItem} instead of {@link ItemDataService#getBundles} for correct cache integration.
   * Defaults to empty until {@link postItemInit} runs.
   */
  bundles$: Observable<Bundle[]> = of([]);

  /**
   * The current field updates for all bundles (e.g. marked for removal)
   */
  bundleFieldUpdates$: Observable<FieldUpdates>;

  /**
   * Find-list options for loading all bundles for the item (single request; list refreshes via reactive stream).
   */
  readonly bundleListFindOptions: FindListOptions = {
    scopeID: 'bundles-pagination-options',
    currentPage: 1,
    elementsPerPage: 9999,
  };

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
   * Subscriptions owned by this component (bundle object-updates wiring)
   */
  subs: Subscription[] = [];

  /**
   * Emits whether the bitstreams service is processing a move request (for UI overlay).
   */
  isProcessingMoveRequest: Observable<boolean>;

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
    this.isProcessingMoveRequest = this.itemBitstreamsService.getPerformingMoveRequest$();
  }

  /**
   * Actions to perform after the item has been initialized
   */
  postItemInit(): void {
    this.bundleUpdatesUrl = `${this.item.self}/bundles`;

    this.bundles$ = this.bundleService.findAllByItem(this.item, this.bundleListFindOptions).pipe(
      getAllSucceededRemoteData(),
      distinctUntilKeyChanged('timeCompleted'),
      getRemoteDataPayload(),
      map((bundlePage: PaginatedList<Bundle>) => bundlePage.page),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.subs.push(this.bundles$.subscribe((bundles: Bundle[]) => {
      this.objectUpdatesService.initialize(this.bundleUpdatesUrl, bundles, new Date());
    }));

    this.bundleFieldUpdates$ = this.bundles$.pipe(
      switchMap((bundles: Bundle[]) => this.objectUpdatesService.getFieldUpdatesExclusive(this.bundleUpdatesUrl, bundles)),
    );
  }

  /**
   * Handles keyboard events that should move the currently selected bitstream up
   */
  @HostListener('document:keydown.arrowUp', ['$event'])
  moveUp(event: KeyboardEvent) {
    if (this.itemBitstreamsService.hasSelectedBitstream()) {
      event.preventDefault();
      this.itemBitstreamsService.moveSelectedBitstreamUp();
    }
  }

  /**
   * Handles keyboard events that should move the currently selected bitstream down
   */
  @HostListener('document:keydown.arrowDown', ['$event'])
  moveDown(event: KeyboardEvent) {
    if (this.itemBitstreamsService.hasSelectedBitstream()) {
      event.preventDefault();
      this.itemBitstreamsService.moveSelectedBitstreamDown();
    }
  }

  /**
   * Handles keyboard events that should cancel the currently selected bitstream.
   * A cancel means that the selected bitstream is returned to its original position and is no longer selected.
   * @param event
   */
  @HostListener('document:keyup.escape', ['$event'])
  cancelSelection(event: KeyboardEvent) {
    if (this.itemBitstreamsService.hasSelectedBitstream()) {
      event.preventDefault();
      this.itemBitstreamsService.cancelSelection();
    }
  }

  /**
   * Handles keyboard events that should clear the currently selected bitstream.
   * A clear means that the selected bitstream remains in its current position but is no longer selected.
   */
  @HostListener('document:keydown.enter', ['$event'])
  @HostListener('document:keydown.space', ['$event'])
  clearSelection(event: KeyboardEvent) {
    // Only when no specific element is in focus do we want to clear the currently selected bitstream
    // Otherwise we might clear the selection when a different action was intended, e.g. clicking a button or selecting
    // a different bitstream.
    if (
      this.itemBitstreamsService.hasSelectedBitstream() &&
      event.target instanceof Element &&
      event.target.tagName === 'BODY'
    ) {
      event.preventDefault();
      this.itemBitstreamsService.clearSelection();
    }
  }

  /**
   * Initialize the notification messages prefix
   */
  initializeNotificationsPrefix(): void {
    this.notificationsPrefix = 'item.edit.bitstreams.notifications.';
  }

  /**
   * Submit the current changes
   * Bundles marked as deleted send a PATCH to the REST API (which also deletes their bitstreams).
   * Bitstreams marked as deleted in non-removed bundles send delete requests.
   * Display notifications and reset the current item/updates.
   */
  submit() {
    this.submitting = true;

    this.subs.push(
      this.itemBitstreamsService.removeMarkedBundlesAndBitstreams(
        this.bundleUpdatesUrl,
        this.bundles$,
        this.bundleFieldUpdates$,
      ).subscribe(({ responses, deletingBundles, deletingBitstreams }) => {
        this.displayRemovalNotifications(responses, deletingBundles, deletingBitstreams);
        this.submitting = false;
      }),
    );
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
        response.errorMessage,
      );
    });

    if (successfulResponses.length > 0) {
      this.notificationsService.success(
        this.translateService.instant(`item.edit.bitstreams.notifications.remove.${keySuffix}.saved.title`),
        this.translateService.instant(`item.edit.bitstreams.notifications.remove.${keySuffix}.saved.content`),
      );
      // Mark the item's bundles collection stale so findAllByItem emits an updated list (bundle self-links alone may not refresh the list endpoint).
      const bundlesHref = this.item?._links?.bundles?.href;
      if (hasValue(bundlesHref)) {
        this.requestService.removeByHrefSubstring(bundlesHref);
      }
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
          path: `/_links/bitstreams/${event.toIndex}/href`,
        } as Operation;
        this.bundleService.patch(bundle, [moveOperation]).pipe(take(1)).subscribe((response: RemoteData<Bundle>) => {
          this.zone.run(() => {
            this.displayNotifications('item.edit.bitstreams.notifications.move', [response]);
            // Remove all cached requests from this bundle and call the event's callback when the requests are cleared
            this.requestService.removeByHrefSubstring(bundle.self).pipe(
              filter((isCached) => isCached),
              take(1),
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
    const undoNotification = this.notificationsService.info(this.getNotificationTitle('discarded'), this.getNotificationContent('discarded'), { timeOut: this.discardTimeOut });
    this.objectUpdatesService.discardAllFieldUpdates(this.url, undoNotification);
    if (hasValue(this.bundleUpdatesUrl)) {
      this.objectUpdatesService.discardFieldUpdates(this.bundleUpdatesUrl, undoNotification);
    }
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
    if (hasValue(this.bundleUpdatesUrl)) {
      this.objectUpdatesService.reinstateFieldUpdates(this.bundleUpdatesUrl);
    }
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
      switchMap((bundles: Bundle[]) => {
        const parts = bundles.map((bundle: Bundle) => this.objectUpdatesService.isReinstatable(bundle.self));
        if (hasValue(this.bundleUpdatesUrl)) {
          parts.unshift(this.objectUpdatesService.isReinstatable(this.bundleUpdatesUrl));
        }
        return parts.length ? combineLatest(parts) : of([false]);
      }),
      map((reinstatable: boolean[]) => reinstatable.includes(true)),
    );
  }

  /**
   * Checks whether or not there are currently updates for this object
   */
  hasChanges(): Observable<boolean> {
    return this.bundles$.pipe(
      switchMap((bundles: Bundle[]) => {
        const parts = bundles.map((bundle: Bundle) => this.objectUpdatesService.hasUpdates(bundle.self));
        if (hasValue(this.bundleUpdatesUrl)) {
          parts.unshift(this.objectUpdatesService.hasUpdates(this.bundleUpdatesUrl));
        }
        return parts.length ? combineLatest(parts) : of([false]);
      }),
      map((hasChanges: boolean[]) => hasChanges.includes(true)),
    );
  }

  /**
   * Unsubscribe from open subscriptions whenever the component gets destroyed
   */
  override ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
    if (hasValue(this.itemUpdateSubscription)) {
      this.itemUpdateSubscription.unsubscribe();
    }
  }
}
