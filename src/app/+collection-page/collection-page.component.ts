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
import { hasValue, isNotEmpty, isUndefined } from '../shared/empty.util';
import { PageInfo } from '../core/shared/page-info.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ds-collection-page',
  styleUrls: ['./collection-page.component.scss'],
  templateUrl: './collection-page.component.html',
})
export class CollectionPageComponent implements OnInit, OnDestroy {
  collectionData: RemoteData<Collection>;
  itemData: RemoteData<Item[]>;
  logoData: RemoteData<Bitstream>;
  paginationConfig: PaginationComponentOptions;
  sortConfig: SortOptions;
  private subs: Subscription[] = [];
  private collectionId: string;

  constructor(private collectionDataService: CollectionDataService,
              private itemDataService: ItemDataService,
              private route: ActivatedRoute) {
    this.paginationConfig = new PaginationComponentOptions();
    this.paginationConfig.id = 'collection-page-pagination';
    this.paginationConfig.pageSizeOptions = [4];
    this.paginationConfig.pageSize = 4;
    this.paginationConfig.currentPage = 1;
    this.sortConfig = new SortOptions();
  }

  ngOnInit(): void {
    this.subs.push(
      Observable.combineLatest(
        this.route.params,
        this.route.queryParams,
        (params, queryParams,) => {
          return Object.assign({}, params, queryParams);
        })
        .subscribe((params) => {
          this.collectionId = params.id;
          this.collectionData = this.collectionDataService.findById(this.collectionId);
          this.subs.push(this.collectionData.payload.subscribe((collection) => this.logoData = collection.logo));

          const page = +params.page || this.paginationConfig.currentPage;
          const pageSize = +params.pageSize || this.paginationConfig.pageSize;
          const sortDirection = +params.page || this.sortConfig.direction;
          const pagination = Object.assign({},
            this.paginationConfig,
            { currentPage: page, pageSize: pageSize }
          );
          const sort = Object.assign({},
            this.sortConfig,
            { direction: sortDirection, field: params.sortField }
          );
          this.updatePage({
            pagination: pagination,
            sort: sort
          });
        }));

  }

  updatePage(searchOptions) {
    this.itemData = this.itemDataService.findAll({
      scopeID: this.collectionId,
      currentPage: searchOptions.pagination.currentPage,
      elementsPerPage: searchOptions.pagination.pageSize,
      sort: searchOptions.sort
    });
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

  isNotEmpty(object: any) {
    return isNotEmpty(object);
  }
}
