import { ChangeDetectorRef, Component, NgZone, OnDestroy, HostListener } from '@angular/core';
import { AbstractItemUpdateComponent } from '../abstract-item-update/abstract-item-update.component';
import { map, switchMap, take } from 'rxjs/operators';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { RequestService } from '../../../core/data/request.service';
import {
  getFirstSucceededRemoteData,
  getRemoteDataPayload,
} from '../../../core/shared/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { Bundle } from '../../../core/shared/bundle.model';
import { BundleDataService } from '../../../core/data/bundle-data.service';
import { PaginatedSearchOptions } from '../../../shared/search/models/paginated-search-options.model';
import { ResponsiveTableSizes } from '../../../shared/responsive-table-sizes/responsive-table-sizes';
import { NoContent } from '../../../core/shared/NoContent.model';
import { ItemBitstreamsService } from './item-bitstreams.service';
import { AlertType } from '../../../shared/alert/alert-type';

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
    const bundlesOptions = this.itemBitstreamsService.getInitialBundlesPaginationOptions();
    this.isProcessingMoveRequest = this.itemBitstreamsService.getPerformingMoveRequest$();

    this.bundles$ = this.itemService.getBundles(this.item.id, new PaginatedSearchOptions({pagination: bundlesOptions})).pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      map((bundlePage: PaginatedList<Bundle>) => bundlePage.page)
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
      switchMap((bundles: Bundle[]) => combineLatest(bundles.map((bundle: Bundle) => this.objectUpdatesService.isReinstatable(bundle.self)))),
      map((reinstatable: boolean[]) => reinstatable.includes(true))
    );
  }

  /**
   * Checks whether or not there are currently updates for this object
   */
  hasChanges(): Observable<boolean> {
    return this.bundles$.pipe(
      switchMap((bundles: Bundle[]) => combineLatest(bundles.map((bundle: Bundle) => this.objectUpdatesService.hasUpdates(bundle.self)))),
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
