import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  NgbDropdownModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
  shareReplay,
  Subscription,
  switchMap,
} from 'rxjs';
import {
  filter,
  map,
  take,
  tap,
} from 'rxjs/operators';
import { PaginatedList } from 'src/app/core/data/paginated-list.model';
import { RemoteData } from 'src/app/core/data/remote-data';
import { Bitstream } from 'src/app/core/shared/bitstream.model';

import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { BundleDataService } from '../../../../core/data/bundle-data.service';
import { FieldChangeType } from '../../../../core/data/object-updates/field-change-type.model';
import { FieldUpdate } from '../../../../core/data/object-updates/field-update.model';
import { FieldUpdates } from '../../../../core/data/object-updates/field-updates.model';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { RequestService } from '../../../../core/data/request.service';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { Bundle } from '../../../../core/shared/bundle.model';
import { Item } from '../../../../core/shared/item.model';
import {
  getAllSucceededRemoteData,
  paginatedListToArray,
} from '../../../../core/shared/operators';
import { BtnDisabledDirective } from '../../../../shared/btn-disabled.directive';
import {
  hasNoValue,
  hasValue,
} from '../../../../shared/empty.util';
import { PaginationComponent } from '../../../../shared/pagination/pagination.component';
import { PaginationComponentOptions } from '../../../../shared/pagination/pagination-component-options.model';
import { ResponsiveColumnSizes } from '../../../../shared/responsive-table-sizes/responsive-column-sizes';
import { ResponsiveTableSizes } from '../../../../shared/responsive-table-sizes/responsive-table-sizes';
import { PaginatedSearchOptions } from '../../../../shared/search/models/paginated-search-options.model';
import { BrowserOnlyPipe } from '../../../../shared/utils/browser-only.pipe';
import { followLink } from '../../../../shared/utils/follow-link-config.model';
import { getItemPageRoute } from '../../../item-page-routing-paths';
import {
  BitstreamTableEntry,
  ItemBitstreamsService,
  MOVE_KEY,
  SelectedBitstreamTableEntry,
  SelectionAction,
} from '../item-bitstreams.service';

@Component({
  selector: 'ds-item-edit-bitstream-bundle',
  styleUrls: ['../item-bitstreams.component.scss', './item-edit-bitstream-bundle.component.scss'],
  templateUrl: './item-edit-bitstream-bundle.component.html',
  imports: [
    BrowserOnlyPipe,
    BtnDisabledDirective,
    CdkDrag,
    CdkDropList,
    CommonModule,
    NgbDropdownModule,
    NgbTooltipModule,
    PaginationComponent,
    RouterLink,
    TranslateModule,
  ],
  standalone: true,
})
/**
 * Component that displays a single bundle of an item on the item bitstreams edit page
 * Creates an embedded view of the contents. This is to ensure the table structure won't break.
 * (which means it'll be added to the parents html without a wrapping ds-item-edit-bitstream-bundle element)
 */
export class ItemEditBitstreamBundleComponent implements OnInit, OnDestroy {
  protected readonly FieldChangeType = FieldChangeType;

  /**
   * The view on the bundle information and bitstreams
   */
  @ViewChild('bundleView', { static: true }) bundleView;

  /**
   * The view on the pagination component
   */
  @ViewChild(PaginationComponent) paginationComponent: PaginationComponent;

  /**
   * The view on the drag tooltip
   */
  @ViewChild('dragTooltip') dragTooltip;

  /**
   * The bundle to display bitstreams for
   */
  @Input() bundle: Bundle;

  /**
   * The item the bundle belongs to
   */
  @Input() item: Item;

  /**
   * The bootstrap sizes used for the columns within this table
   */
  @Input() columnSizes: ResponsiveTableSizes;

  /**
   * Whether this is the first in a series of bundle tables
   */
  @Input() isFirstTable = false;

  /**
   * The bootstrap sizes used for the Bundle Name column
   * This column stretches over the first 3 columns and thus is a combination of their sizes processed in ngOnInit
   */
  bundleNameColumn: ResponsiveColumnSizes;

  /**
   * Route to the item's page
   */
  itemPageRoute: string;

  /**
   * The name of the bundle
   */
  bundleName: string;

  /**
   * The number of bitstreams in the bundle
   */
  bundleSize: number;

  /**
   * The bitstreams to show in the table
   */
  bitstreamsRD$: Observable<RemoteData<PaginatedList<Bitstream>>>;

  /**
   * The data to show in the table
   */
  tableEntries$: BehaviorSubject<BitstreamTableEntry[]> = new BehaviorSubject([]);

  /**
   * The initial page options to use for fetching the bitstreams
   */
  paginationOptions: PaginationComponentOptions;

  /**
   * The current page options
   */
  currentPaginationOptions$: BehaviorSubject<PaginationComponentOptions>;

  /**
   * The currently selected page size
   */
  pageSize$: BehaviorSubject<number>;

  /**
   * The self url of the bundle, also used when retrieving fieldUpdates
   */
  bundleUrl: string;

  /**
   * The updates to the current bitstreams
   */
  updates$: BehaviorSubject<FieldUpdates> = new BehaviorSubject(null);

  /**
   * Array containing all subscriptions created by this component
   */
  subscriptions: Subscription[] = [];


  constructor(
    protected viewContainerRef: ViewContainerRef,
    public dsoNameService: DSONameService,
    protected bundleService: BundleDataService,
    protected objectUpdatesService: ObjectUpdatesService,
    protected paginationService: PaginationService,
    protected requestService: RequestService,
    protected itemBitstreamsService: ItemBitstreamsService,
  ) {
  }

  ngOnInit(): void {
    this.bundleNameColumn = this.columnSizes.combineColumns(0, 2);
    this.viewContainerRef.createEmbeddedView(this.bundleView);
    this.itemPageRoute = getItemPageRoute(this.item);
    this.bundleName = this.dsoNameService.getName(this.bundle);
    this.bundleUrl = this.bundle.self;

    this.initializePagination();
    this.initializeBitstreams();
    this.initializeSelectionActions();
  }

  ngOnDestroy() {
    this.viewContainerRef.clear();
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }

  protected initializePagination() {
    this.paginationOptions = this.itemBitstreamsService.getInitialBitstreamsPaginationOptions(this.bundleName);

    this.currentPaginationOptions$ = new BehaviorSubject(this.paginationOptions);
    this.pageSize$ = new BehaviorSubject(this.paginationOptions.pageSize);

    this.subscriptions.push(
      this.paginationService.getCurrentPagination(this.paginationOptions.id, this.paginationOptions)
        .subscribe((pagination) => {
          this.currentPaginationOptions$.next(pagination);
          this.pageSize$.next(pagination.pageSize);
        }),
    );

  }

  protected initializeBitstreams() {
    this.bitstreamsRD$ = this.currentPaginationOptions$.pipe(
      switchMap((page: PaginationComponentOptions) => {
        const paginatedOptions = new PaginatedSearchOptions({ pagination: Object.assign({}, page) });
        return this.bundleService.getBitstreamsEndpoint(this.bundle.id, paginatedOptions).pipe(
          switchMap((href) => this.requestService.hasByHref$(href)),
          switchMap(() => this.bundleService.getBitstreams(
            this.bundle.id,
            paginatedOptions,
            followLink('format'),
          )),
        );
      }),
      getAllSucceededRemoteData(),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.subscriptions.push(
      this.bitstreamsRD$.pipe(
        take(1),
        tap(bitstreamsRD => this.bundleSize = bitstreamsRD.payload.totalElements),
        paginatedListToArray(),
      ).subscribe((bitstreams) => {
        this.objectUpdatesService.initialize(this.bundleUrl, bitstreams, new Date());
      }),

      this.bitstreamsRD$.pipe(
        paginatedListToArray(),
        switchMap((bitstreams) => this.objectUpdatesService.getFieldUpdatesExclusive(this.bundleUrl, bitstreams)),
      ).subscribe((updates) => this.updates$.next(updates)),

      this.bitstreamsRD$.pipe(
        paginatedListToArray(),
        map((bitstreams) => this.itemBitstreamsService.mapBitstreamsToTableEntries(bitstreams)),
      ).subscribe((tableEntries) => this.tableEntries$.next(tableEntries)),
    );
  }

  protected initializeSelectionActions() {
    this.subscriptions.push(
      this.itemBitstreamsService.getSelectionAction$().subscribe(
        selectionAction => this.handleSelectionAction(selectionAction)),
    );
  }

  /**
   * Handles a change in selected bitstream by changing the pagination if the change happened on a different page
   * @param selectionAction
   */
  handleSelectionAction(selectionAction: SelectionAction) {
    if (hasNoValue(selectionAction) || selectionAction.selectedEntry.bundle !== this.bundle) {
      return;
    }

    if (selectionAction.action === 'Moved') {
      // If the currently selected bitstream belongs to this bundle, it has possibly moved to a different page.
      // In that case we want to change the pagination to the new page.
      this.redirectToCurrentPage(selectionAction.selectedEntry);
    }

    if (selectionAction.action === 'Cancelled') {
      // If the selection is cancelled (and returned to its original position), it is possible the previously selected
      // bitstream is returned to a different page. In that case we want to change the pagination to the place where
      // the bitstream was returned to.
      this.redirectToOriginalPage(selectionAction.selectedEntry);
    }

    if (selectionAction.action === 'Cleared') {
      // If the selection is cleared, it is possible the previously selected bitstream is on a different page. In that
      // case we want to change the pagination to the place where the bitstream is.
      this.redirectToCurrentPage(selectionAction.selectedEntry);
    }
  }

  /**
   * Redirect the user to the current page of the provided bitstream if it is on a different page.
   * @param bitstreamEntry The entry that the current position will be taken from to determine the page to move to
   * @protected
   */
  protected redirectToCurrentPage(bitstreamEntry: SelectedBitstreamTableEntry) {
    const currentPage = this.getCurrentPage();
    const selectedEntryPage = this.bundleIndexToPage(bitstreamEntry.currentPosition);

    if (currentPage !== selectedEntryPage) {
      this.changeToPage(selectedEntryPage);
    }
  }

  /**
   * Redirect the user to the original page of the provided bitstream if it is on a different page.
   * @param bitstreamEntry The entry that the original position will be taken from to determine the page to move to
   * @protected
   */
  protected redirectToOriginalPage(bitstreamEntry: SelectedBitstreamTableEntry) {
    const currentPage = this.getCurrentPage();
    const originPage = this.bundleIndexToPage(bitstreamEntry.originalPosition);

    if (currentPage !== originPage) {
      this.changeToPage(originPage);
    }
  }

  /**
   * Check if a user should be allowed to remove this field
   */
  canRemove(fieldUpdate: FieldUpdate): boolean {
    return fieldUpdate.changeType !== FieldChangeType.REMOVE;
  }

  /**
   * Check if a user should be allowed to cancel the update to this field
   */
  canUndo(fieldUpdate: FieldUpdate): boolean {
    return fieldUpdate.changeType >= FieldChangeType.UPDATE;
  }

  /**
   * Sends a new remove update for this field to the object updates service
   */
  remove(bitstream: Bitstream): void {
    this.objectUpdatesService.saveRemoveFieldUpdate(this.bundleUrl, bitstream);
  }

  /**
   * Cancels the current update for this field in the object updates service
   */
  undo(bitstream: Bitstream): void {
    this.objectUpdatesService.removeSingleFieldUpdate(this.bundleUrl, bitstream.uuid);
  }

  /**
   * Returns the css class for a table row depending on the state of the table entry.
   * @param update
   * @param bitstream
   */
  getRowClass(update: FieldUpdate, bitstream: BitstreamTableEntry): string {
    const selected = this.itemBitstreamsService.getSelectedBitstream();

    if (hasValue(selected) && bitstream.id === selected.bitstream.id) {
      return 'table-info';
    }

    switch (update.changeType) {
      case FieldChangeType.UPDATE:
        return 'table-warning';
      case FieldChangeType.ADD:
        return 'table-success';
      case FieldChangeType.REMOVE:
        return 'table-danger';
      default:
        return 'bg-white';
    }
  }

  /**
   * Changes the page size to the provided page size.
   * @param pageSize
   */
  public doPageSizeChange(pageSize: number) {
    this.paginationComponent.doPageSizeChange(pageSize);
  }

  /**
   * Handles start of dragging by opening the tooltip mentioning that it is possible to drag a bitstream to a different
   * page by dropping it on the page number, only if there are multiple pages.
   */
  dragStart() {
    // Only open the drag tooltip when there are multiple pages
    this.paginationComponent.shouldShowBottomPager.pipe(
      take(1),
      filter((hasMultiplePages) => hasMultiplePages),
    ).subscribe(() => {
      this.dragTooltip.open();
    });
  }

  /**
   * Handles end of dragging by closing the tooltip.
   */
  dragEnd() {
    this.dragTooltip.close();
  }

  /**
   * Handles dropping by calculation the target position, and changing the page if the bitstream was dropped on a
   * different page.
   * @param event
   */
  drop(event: CdkDragDrop<any>) {
    const dragIndex = event.previousIndex;
    let dropIndex = event.currentIndex;
    const dragPage = this.getCurrentPage();
    let dropPage = this.getCurrentPage();

    // Check if the user is hovering over any of the pagination's pages at the time of dropping the object
    const droppedOnElement = document.elementFromPoint(event.dropPoint.x, event.dropPoint.y);
    if (hasValue(droppedOnElement) && hasValue(droppedOnElement.textContent) && droppedOnElement.classList.contains('page-link')) {
      // The user is hovering over a page, fetch the page's number from the element
      let droppedPage = Number(droppedOnElement.textContent);
      if (hasValue(droppedPage) && !Number.isNaN(droppedPage)) {
        droppedPage -= 1;

        if (droppedPage !== dragPage) {
          dropPage = droppedPage;

          if (dropPage > dragPage) {
            // When moving to later page, place bitstream at the top
            dropIndex = 0;
          } else {
            // When moving to earlier page, place bitstream at the bottom
            dropIndex = this.getCurrentPageSize() - 1;
          }
        }
      }
    }

    const fromIndex = this.pageIndexToBundleIndex(dragIndex, dragPage);
    const toIndex = this.pageIndexToBundleIndex(dropIndex, dropPage);

    if (fromIndex === toIndex) {
      return;
    }

    const selectedBitstream = this.tableEntries$.value[dragIndex];

    const finish = () => {
      this.itemBitstreamsService.announceMove(selectedBitstream.name, toIndex);

      if (dropPage !== this.getCurrentPage()) {
        this.changeToPage(dropPage);
      }

      this.itemBitstreamsService.displaySuccessNotification(MOVE_KEY);
    };

    this.itemBitstreamsService.performBitstreamMoveRequest(this.bundle, fromIndex, toIndex, finish);
  }

  /**
   * Handles a select action for the provided bitstream entry.
   * If the selected bitstream is currently selected, the selection is cleared.
   * If no, or a different bitstream, is selected, the provided bitstream becomes the selected bitstream.
   * @param event The event that triggered the select action
   * @param bitstream The bitstream that is the target of the select action
   */
  select(event: UIEvent, bitstream: BitstreamTableEntry) {
    event.preventDefault();

    if (event instanceof KeyboardEvent && event.repeat) {
      // Don't handle hold events, otherwise it would change rapidly between being selected and unselected
      return;
    }

    const selectedBitstream = this.itemBitstreamsService.getSelectedBitstream();

    if (hasValue(selectedBitstream) && selectedBitstream.bitstream === bitstream) {
      this.itemBitstreamsService.cancelSelection();
    } else {
      const selectionObject = this.createBitstreamSelectionObject(bitstream);

      if (hasNoValue(selectionObject)) {
        console.warn('Failed to create selection object');
        return;
      }

      this.itemBitstreamsService.selectBitstreamEntry(selectionObject);
    }
  }

  /**
   * Creates a {@link SelectedBitstreamTableEntry} from the provided {@link BitstreamTableEntry} so it can be given
   * to the {@link ItemBitstreamsService} to select the table entry.
   * @param bitstream The table entry to create the selection object from.
   * @protected
   */
  protected createBitstreamSelectionObject(bitstream: BitstreamTableEntry): SelectedBitstreamTableEntry {
    const pageIndex = this.findBitstreamPageIndex(bitstream);

    if (pageIndex === -1) {
      return null;
    }

    const position = this.pageIndexToBundleIndex(pageIndex, this.getCurrentPage());

    return {
      bitstream: bitstream,
      bundle: this.bundle,
      bundleSize: this.bundleSize,
      currentPosition: position,
      originalPosition: position,
    };
  }

  /**
   * Returns the index of the provided {@link BitstreamTableEntry} relative to the current page
   * If the current page size is 10, it will return a value from 0 to 9 (inclusive)
   * Returns -1 if the provided bitstream could not be found
   * @protected
   */
  protected findBitstreamPageIndex(bitstream: BitstreamTableEntry): number {
    const entries = this.tableEntries$.value;
    return entries.findIndex(entry => entry === bitstream);
  }

  /**
   * Returns the current zero-indexed page
   * @protected
   */
  protected getCurrentPage(): number {
    // The pagination component uses one-based numbering while zero-based numbering is more convenient for calculations
    return this.currentPaginationOptions$.value.currentPage - 1;
  }

  /**
   * Returns the current page size
   * @protected
   */
  protected getCurrentPageSize(): number {
    return this.currentPaginationOptions$.value.pageSize;
  }

  /**
   * Converts an index relative to the page to an index relative to the bundle
   * @param index The index relative to the page
   * @param page  The zero-indexed page number
   * @protected
   */
  protected pageIndexToBundleIndex(index: number, page: number) {
    return page * this.getCurrentPageSize() + index;
  }

  /**
   * Calculates the zero-indexed page number from the index relative to the bundle
   * @param index The index relative to the bundle
   * @protected
   */
  protected bundleIndexToPage(index: number) {
    return Math.floor(index / this.getCurrentPageSize());
  }

  /**
   * Change the pagination for this bundle to the provided zero-indexed page
   * @param page The zero-indexed page to change to
   * @protected
   */
  protected changeToPage(page: number) {
    // Increments page by one because zero-indexing is way easier for calculations but the pagination component
    // uses one-indexing.
    this.paginationComponent.doPageChange(page + 1);
  }

}
