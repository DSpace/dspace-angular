import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { Bundle } from '../../../../core/shared/bundle.model';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { Observable } from 'rxjs/internal/Observable';
import { FieldUpdates } from '../../../../core/data/object-updates/object-updates.reducer';
import { toBitstreamsArray } from '../../../../core/shared/item-bitstreams-utils';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { Item } from '../../../../core/shared/item.model';
import { CdkDragDrop, CdkDragStart } from '@angular/cdk/drag-drop';
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

  constructor(private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit(): void {
    this.viewContainerRef.createEmbeddedView(this.bundleView);
  }
}
