import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { Collection } from '../core/shared/collection.model';
import { Bitstream } from '../core/shared/bitstream.model';
import { RemoteData } from '../core/data/remote-data';
import { CollectionDataService } from '../core/data/collection-data.service';
import { ItemDataService } from '../core/data/item-data.service';
import { Item } from '../core/shared/item.model';
import { SortOptions, SortDirection } from '../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { hasValue, isUndefined } from '../shared/empty.util';
import { PageInfo } from '../core/shared/page-info.model';

@Component({
  selector: 'ds-collection-page',
  styleUrls: ['./collection-page.component.scss'],
  templateUrl: './collection-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionPageComponent implements OnInit, OnDestroy {
  collectionData: RemoteData<Collection>;
  itemData: RemoteData<Item[]>;
  logoData: RemoteData<Bitstream>;
  config: PaginationComponentOptions;
  sortConfig: SortOptions;
  private subs: Subscription[] = [];
  private collectionId: string;
  private pageInfoState: PageInfo;

  constructor(
    private collectionDataService: CollectionDataService,
    private itemDataService: ItemDataService,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.subs.push(this.route.params.map((params: Params) => params.id)
      .subscribe((id: string) => {
        this.collectionId = id;
        this.collectionData = this.collectionDataService.findById(this.collectionId);
        this.subs.push(this.collectionData.payload.subscribe((collection) => this.logoData = collection.logo));

        this.config = new PaginationComponentOptions();
        this.config.id = 'collection-browse';
        this.config.pageSizeOptions = [4];
        this.config.pageSize = 4;
        this.sortConfig = new SortOptions();

        this.updateResults();
      }));

  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

  onPageChange(currentPage: number): void {
    this.config.currentPage = currentPage;
    this.updateResults();
  }

  onPageSizeChange(elementsPerPage: number): void {
    this.config.pageSize = elementsPerPage;
    this.updateResults();
  }

  onSortDirectionChange(sortDirection: SortDirection): void {
    this.sortConfig = new SortOptions(this.sortConfig.field, sortDirection);
    this.updateResults();
  }

  onSortFieldChange(field: string): void {
    this.sortConfig = new SortOptions(field, this.sortConfig.direction);
    this.updateResults();
  }

  updateResults() {
    this.itemData = null;
    this.ref.markForCheck();
    this.itemData = this.itemDataService.findAll({
      scopeID: this.collectionId,
      currentPage: this.config.currentPage,
      elementsPerPage: this.config.pageSize,
      sort: this.sortConfig
    });
    this.subs.push(this.itemData.pageInfo.subscribe((pageInfo) => {
      if (isUndefined(this.pageInfoState) || this.pageInfoState !== pageInfo) {
        this.pageInfoState = pageInfo;
        this.ref.detectChanges();
      }
    }));
  }
}
