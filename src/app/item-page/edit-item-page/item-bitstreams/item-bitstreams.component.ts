import {
  AsyncPipe,
  CommonModule,
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
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Operation } from 'fast-json-patch';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subscription,
} from 'rxjs';
import {
  filter,
  map,
  switchMap,
  take,
} from 'rxjs/operators';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { AlertType } from 'src/app/shared/alert/alert-type';

import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { BundleDataService } from '../../../core/data/bundle-data.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { RequestService } from '../../../core/data/request.service';
import { Bundle } from '../../../core/shared/bundle.model';
import { NoContent } from '../../../core/shared/NoContent.model';
import {
  getFirstSucceededRemoteData,
  getRemoteDataPayload,
} from '../../../core/shared/operators';
import { BtnDisabledDirective } from '../../../shared/btn-disabled.directive';
import {
  hasValue,
  isNotEmpty,
} from '../../../shared/empty.util';
import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { ResponsiveTableSizes } from '../../../shared/responsive-table-sizes/responsive-table-sizes';
import { PaginatedSearchOptions } from '../../../shared/search/models/paginated-search-options.model';
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
    CommonModule,
    ItemEditBitstreamBundleComponent,
    RouterLink,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
  providers: [ObjectValuesPipe],
  standalone: true,
})
/**
 * Component for displaying an item's bitstreams edit page
 */
export class ItemBitstreamsComponent extends AbstractItemUpdateComponent implements OnDestroy {

  // Declared for use in template
  protected readonly AlertType = AlertType;

  /**
   * All bundles for the current item
   */
  private bundlesSubject = new BehaviorSubject<Bundle[]>([]);

  /**
   * The page options to use for fetching the bundles
   */
  bundlesOptions: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'bundles-pagination-options',
    currentPage: 1,
    pageSize: 10,
  });

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

  /**
   * The flag indicating to show the load more link
   */
  showLoadMoreLink$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  /**
   * The list of bundles for the current item as an observable
   */
  get bundles$(): Observable<Bundle[]> {
    return this.bundlesSubject.asObservable();
  }

  /**
   * An observable which emits a boolean which represents whether the service is currently handling a 'move' request
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
  }

  /**
   * Actions to perform after the item has been initialized
   */
  postItemInit(): void {
    this.loadBundles(1);
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
   * Load bundles for the current item
   * @param currentPage The current page to load
   */
  loadBundles(currentPage?: number) {
    this.bundlesOptions = Object.assign(new PaginationComponentOptions(), this.bundlesOptions, {
      currentPage: currentPage || this.bundlesOptions.currentPage + 1,
    });
    this.itemService.getBundles(this.item.id, new PaginatedSearchOptions({ pagination: this.bundlesOptions })).pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
    ).subscribe((bundles: PaginatedList<Bundle>) => {
      this.updateBundles(bundles);
    });
  }

  /**
   * Update the subject containing the bundles with the provided bundles.
   * Also updates the showLoadMoreLink observable so it does not show up when it is no longer necessary.
   */
  updateBundles(newBundlesPL: PaginatedList<Bundle>) {
    const currentBundles = this.bundlesSubject.getValue();

    // Only add bundles to the bundle subject if they are not present yet
    const bundlesToAdd = newBundlesPL.page
      .filter(bundleToAdd => !currentBundles.some(currentBundle => currentBundle.id === bundleToAdd.id));

    const updatedBundles = [...currentBundles, ...bundlesToAdd];

    this.showLoadMoreLink$.next(updatedBundles.length < newBundlesPL.totalElements);
    this.bundlesSubject.next(updatedBundles);
  }


  /**
   * Submit the current changes
   * Bitstreams marked as deleted send out a delete request to the rest API
   * Display notifications and reset the current item/updates
   */
  submit() {
    this.submitting = true;

    const removedResponses$ = this.itemBitstreamsService.removeMarkedBitstreams(this.bundles$.pipe(take(1)));

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
      switchMap((bundles: Bundle[]) => combineLatest(bundles.map((bundle: Bundle) => this.objectUpdatesService.isReinstatable(bundle.self)))),
      map((reinstatable: boolean[]) => reinstatable.includes(true)),
    );
  }

  /**
   * Checks whether or not there are currently updates for this object
   */
  hasChanges(): Observable<boolean> {
    return this.bundles$.pipe(
      switchMap((bundles: Bundle[]) => combineLatest(bundles.map((bundle: Bundle) => this.objectUpdatesService.hasUpdates(bundle.self)))),
      map((hasChanges: boolean[]) => hasChanges.includes(true)),
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
