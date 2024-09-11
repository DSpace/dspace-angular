import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { Bundle } from '../../../../core/shared/bundle.model';
import { Item } from '../../../../core/shared/item.model';
import { ResponsiveColumnSizes } from '../../../../shared/responsive-table-sizes/responsive-column-sizes';
import { ResponsiveTableSizes } from '../../../../shared/responsive-table-sizes/responsive-table-sizes';
import { getItemPageRoute } from '../../../item-page-routing-paths';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { RemoteData } from 'src/app/core/data/remote-data';
import { PaginatedList } from 'src/app/core/data/paginated-list.model';
import { Bitstream } from 'src/app/core/shared/bitstream.model';
import { Observable, BehaviorSubject, switchMap } from 'rxjs';
import { PaginationComponentOptions } from '../../../../shared/pagination/pagination-component-options.model';
import { FieldUpdates } from '../../../../core/data/object-updates/field-updates.model';
import { PaginatedSearchOptions } from '../../../../shared/search/models/paginated-search-options.model';
import { BundleDataService } from '../../../../core/data/bundle-data.service';
import { followLink } from '../../../../shared/utils/follow-link-config.model';
import {
  getAllSucceededRemoteData,
  paginatedListToArray,
  getFirstSucceededRemoteData
} from '../../../../core/shared/operators';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { BitstreamFormat } from '../../../../core/shared/bitstream-format.model';
import { map } from 'rxjs/operators';
import { FieldChangeType } from '../../../../core/data/object-updates/field-change-type.model';
import { FieldUpdate } from '../../../../core/data/object-updates/field-update.model';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { PaginationComponent } from '../../../../shared/pagination/pagination.component';
import { RequestService } from '../../../../core/data/request.service';
import { ItemBitstreamsService } from '../item-bitstreams.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

/**
 * Interface storing all the information necessary to create a row in the bitstream edit table
 */
export interface BitstreamTableEntry {
  /**
   * The bitstream
   */
  bitstream: Bitstream,
  /**
   * The uuid of the Bitstream
   */
  id: string,
  /**
   * The name of the Bitstream
   */
  name: string,
  /**
   * The name of the Bitstream with all whitespace removed
   */
  nameStripped: string,
  /**
   * The description of the Bitstream
   */
  description: string,
  /**
   * Observable emitting the Format of the Bitstream
   */
  format: Observable<BitstreamFormat>,
  /**
   * The download url of the Bitstream
   */
  downloadUrl: string,
}

@Component({
  selector: 'ds-item-edit-bitstream-bundle',
  styleUrls: ['../item-bitstreams.component.scss', './item-edit-bitstream-bundle.component.scss'],
  templateUrl: './item-edit-bitstream-bundle.component.html',
})
/**
 * Component that displays a single bundle of an item on the item bitstreams edit page
 * Creates an embedded view of the contents. This is to ensure the table structure won't break.
 * (which means it'll be added to the parents html without a wrapping ds-item-edit-bitstream-bundle element)
 */
export class ItemEditBitstreamBundleComponent implements OnInit {
  protected readonly FieldChangeType = FieldChangeType;

  /**
   * The view on the bundle information and bitstreams
   */
  @ViewChild('bundleView', {static: true}) bundleView;

  @ViewChild(PaginationComponent) paginationComponent: PaginationComponent;

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
   * Send an event when the user drops an object on the pagination
   * The event contains details about the index the object came from and is dropped to (across the entirety of the list,
   * not just within a single page)
   */
  @Output() dropObject: EventEmitter<any> = new EventEmitter<any>();

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
   * The bitstreams to show in the table
   */
  bitstreamsRD$: Observable<RemoteData<PaginatedList<Bitstream>>>;

  /**
   * The data to show in the table
   */
  tableEntries$: Observable<BitstreamTableEntry[]>;

  /**
   * The initial page options to use for fetching the bitstreams
   */
  paginationOptions: PaginationComponentOptions;

  /**
   * The current page options
   */
  currentPaginationOptions$: BehaviorSubject<PaginationComponentOptions>;

  /**
   * The available page size options
   */
  pageSizeOptions: number[];

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
  updates$: Observable<FieldUpdates>;


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

    // this.bitstreamsRD = this.
  }

  protected initializePagination() {
    this.paginationOptions = this.itemBitstreamsService.getInitialBitstreamsPaginationOptions(this.bundleName);

    this.pageSizeOptions = this.paginationOptions.pageSizeOptions;

    this.currentPaginationOptions$ = new BehaviorSubject(this.paginationOptions);
    this.pageSize$ = new BehaviorSubject(this.paginationOptions.pageSize);

    this.paginationService.getCurrentPagination(this.paginationOptions.id, this.paginationOptions)
      .subscribe((pagination) => {
        this.currentPaginationOptions$.next(pagination);
        this.pageSize$.next(pagination.pageSize);
    });
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
            followLink('format')
          ))
        );
      }),
    );

    this.bitstreamsRD$.pipe(
      getFirstSucceededRemoteData(),
      paginatedListToArray(),
    ).subscribe((bitstreams) => {
      this.objectUpdatesService.initialize(this.bundleUrl, bitstreams, new Date());
    });

    this.updates$ = this.bitstreamsRD$.pipe(
      getAllSucceededRemoteData(),
      paginatedListToArray(),
      switchMap((bitstreams) => this.objectUpdatesService.getFieldUpdatesExclusive(this.bundleUrl, bitstreams))
    );

    this.tableEntries$ = this.bitstreamsRD$.pipe(
      getAllSucceededRemoteData(),
      paginatedListToArray(),
      map((bitstreams) => this.itemBitstreamsService.mapBitstreamsToTableEntries(bitstreams)),
    );
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
    return fieldUpdate.changeType >= 0;
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

  getRowClass(update: FieldUpdate): string {
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

  public doPageSizeChange(pageSize: number) {
    this.paginationComponent.doPageSizeChange(pageSize);
  }

  drop(event: CdkDragDrop<any>) {
    console.log('dropEvent:', event);
  }

}
