import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { Bundle } from '../../../../core/shared/bundle.model';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { Observable } from 'rxjs/internal/Observable';
import { FieldUpdates } from '../../../../core/data/object-updates/object-updates.reducer';
import { toBitstreamsArray } from '../../../../core/shared/item-bitstreams-utils';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { Item } from '../../../../core/shared/item.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { BundleDataService } from '../../../../core/data/bundle-data.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { hasNoValue, isEmpty } from '../../../../shared/empty.util';
import { PaginatedSearchOptions } from '../../../../shared/search/paginated-search-options.model';
import { PaginationComponentOptions } from '../../../../shared/pagination/pagination-component-options.model';

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
  batchSize = 2;

  /**
   * The page options to use for fetching the bitstreams
   */
  bitstreamsOptions = Object.assign(new PaginationComponentOptions(),{
    id: 'bitstreams-pagination-options',
    currentPage: 1,
    pageSize: this.batchSize
  });

  /**
   * The current page we're displaying for this bundle
   */
  currentPage$ = new BehaviorSubject<number>(1);

  /**
   * A list of pages that have been initialized in the field-update store
   */
  initializedPages: number[] = [];

  constructor(private objectUpdatesService: ObjectUpdatesService,
              private bundleService: BundleDataService,
              private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit(): void {
    this.bitstreamsRD$ = this.currentPage$.pipe(
      switchMap((page: number) => this.bundleService.getBitstreams(this.bundle.id,
        new PaginatedSearchOptions({pagination: Object.assign({}, this.bitstreamsOptions, { currentPage: page })})))
    );
    this.updates$ = this.bitstreamsRD$.pipe(
      toBitstreamsArray(),
      tap((bitstreams: Bitstream[]) => {
        // Pages in the field-update store are indexed starting at 0 (because they're stored in an array of pages)
        const updatesPage = this.currentPage$.value - 1;
        if (isEmpty(this.initializedPages)) {
          // No updates have been initialized yet for this bundle, initialize the first page
          this.objectUpdatesService.initializeWithCustomOrder(this.bundle.self, bitstreams, new Date(), this.batchSize, updatesPage);
          this.initializedPages.push(updatesPage);
        } else if (this.initializedPages.indexOf(this.currentPage$.value) < 0) {
          // Updates were initialized for this bundle, but not the page we're on. Add the current page to the field-update store for this bundle
          this.objectUpdatesService.addPageToCustomOrder(this.bundle.self, bitstreams, updatesPage);
          this.initializedPages.push(updatesPage);
        }
      }),
      switchMap((bitstreams: Bitstream[]) => this.objectUpdatesService.getFieldUpdatesByCustomOrder(this.bundle.self, bitstreams, this.currentPage$.value - 1))
    );

    this.viewContainerRef.createEmbeddedView(this.bundleView);
  }

  /**
   * Update the current page
   * @param page
   */
  switchPage(page: number) {
    this.currentPage$.next(page);
  }

  /**
   * A bitstream was moved, send updates to the store
   * @param event
   */
  drop(event: CdkDragDrop<any>) {
    this.objectUpdatesService.saveMoveFieldUpdate(this.bundle.self, event.previousIndex, event.currentIndex);
  }
}
