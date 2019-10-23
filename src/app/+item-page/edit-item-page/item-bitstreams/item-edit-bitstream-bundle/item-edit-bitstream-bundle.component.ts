import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { Bundle } from '../../../../core/shared/bundle.model';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { Observable } from 'rxjs/internal/Observable';
import { FieldUpdates } from '../../../../core/data/object-updates/object-updates.reducer';
import { toBitstreamsArray } from '../../../../core/shared/item-bitstreams-utils';
import { map, switchMap, tap } from 'rxjs/operators';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { Item } from '../../../../core/shared/item.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { BundleDataService } from '../../../../core/data/bundle-data.service';
import { PaginatedSearchOptions } from '../../../../+search-page/paginated-search-options.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { combineLatest as observableCombineLatest } from 'rxjs';

@Component({
  selector: 'ds-item-edit-bitstream-bundle',
  styleUrls: ['../item-bitstreams.component.scss'],
  templateUrl: './item-edit-bitstream-bundle.component.html',
})
/**
 * Component that displays a single bundle of an item on the item bitstreams edit page
 */
export class ItemEditBitstreamBundleComponent implements OnInit {

  /**
   * The view on the bundle information and bitstreams
   */
  @ViewChild('bundleView') bundleView;

  /**
   * The bundle to display bitstreams for
   */
  @Input() bundle: Bundle;

  /**
   * The item the bundle belongs to
   */
  @Input() item: Item;

  /**
   * The current url of this page
   */
  @Input() url: string;

  /**
   * The bitstreams within this bundle retrieved from the REST API
   */
  bitstreamsRD$: Observable<RemoteData<PaginatedList<Bitstream>>>;

  /**
   * The updates to the current bundle
   */
  updates$: Observable<FieldUpdates>;

  /**
   * The amount of one bitstreams one "batch" resembles
   * The user is able to increase the amount of bitstreams displayed per bundle by this batch size until all are shown
   */
  batchSize = 10;

  /**
   * The page options to use for fetching the bitstreams
   */
  bitstreamsOptions = {
    id: 'bitstreams-pagination-options',
    currentPage: 1,
    pageSize: this.batchSize
  } as any;

  /**
   * The current amount of bitstreams to display for this bundle
   * Starts off with just one batch
   */
  currentSize$ = new BehaviorSubject<number>(this.batchSize);

  /**
   * Are we currently loading more bitstreams?
   */
  isLoadingMore$: Observable<boolean>;

  constructor(private objectUpdatesService: ObjectUpdatesService,
              private bundleService: BundleDataService,
              private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit(): void {
    this.bitstreamsRD$ = this.currentSize$.pipe(
      switchMap((size: number) => this.bundleService.getBitstreams(this.bundle.id,
        new PaginatedSearchOptions({pagination: Object.assign({}, this.bitstreamsOptions, { pageSize: size })})))
    );
    this.updates$ = this.bitstreamsRD$.pipe(
      toBitstreamsArray(),
      tap((bitstreams: Bitstream[]) => this.objectUpdatesService.initialize(this.bundle.self, bitstreams, new Date(), true)),
      switchMap((bitstreams: Bitstream[]) => this.objectUpdatesService.getFieldUpdatesByCustomOrder(this.bundle.self, bitstreams))
    );
    this.isLoadingMore$ = observableCombineLatest(this.currentSize$, this.bitstreamsRD$).pipe(
      map(([size, bitstreamsRD]: [number, RemoteData<PaginatedList<Bitstream>>]) => size > bitstreamsRD.payload.page.length)
    );

    this.viewContainerRef.createEmbeddedView(this.bundleView);
  }

  /**
   * A bitstream was moved, send updates to the store
   * @param event
   */
  drop(event: CdkDragDrop<any>) {
    this.objectUpdatesService.saveMoveFieldUpdate(this.bundle.self, event.previousIndex, event.currentIndex);
  }

  /**
   * Load more bitstreams (current size + batchSize)
   */
  loadMore() {
    this.currentSize$.next(this.currentSize$.value + this.batchSize);
  }

  /**
   * Load all bitstreams
   */
  loadAll() {
    this.currentSize$.next(9999);
  }
}
