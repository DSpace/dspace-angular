import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable,  Subscription } from 'rxjs';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { CollectionDataService } from '../core/data/collection-data.service';
import { PaginatedList } from '../core/data/paginated-list';
import { RemoteData } from '../core/data/remote-data';

import { MetadataService } from '../core/metadata/metadata.service';
import { Bitstream } from '../core/shared/bitstream.model';

import { Collection } from '../core/shared/collection.model';
import { Item } from '../core/shared/item.model';

import { fadeIn, fadeInOut } from '../shared/animations/fade';
import { hasValue, isNotEmpty } from '../shared/empty.util';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { filter, flatMap, map } from 'rxjs/operators';
import { SearchService } from '../+search-page/search-service/search.service';
import { PaginatedSearchOptions } from '../+search-page/paginated-search-options.model';
import { toDSpaceObjectListRD } from '../core/shared/operators';
import { DSpaceObjectType } from '../core/shared/dspace-object-type.model';

@Component({
  selector: 'ds-collection-page',
  styleUrls: ['./collection-page.component.scss'],
  templateUrl: './collection-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut
  ]
})
export class CollectionPageComponent implements OnInit, OnDestroy {
  collectionRD$: Observable<RemoteData<Collection>>;
  itemRD$: Observable<RemoteData<PaginatedList<Item>>>;
  logoRD$: Observable<RemoteData<Bitstream>>;
  paginationConfig: PaginationComponentOptions;
  sortConfig: SortOptions;
  private subs: Subscription[] = [];
  private collectionId: string;

  constructor(
    private collectionDataService: CollectionDataService,
    private searchService: SearchService,
    private metadata: MetadataService,
    private route: ActivatedRoute
  ) {
    this.paginationConfig = new PaginationComponentOptions();
    this.paginationConfig.id = 'collection-page-pagination';
    this.paginationConfig.pageSize = 5;
    this.paginationConfig.currentPage = 1;
    this.sortConfig = new SortOptions('dc.date.accessioned', SortDirection.DESC);
  }

  ngOnInit(): void {
    this.collectionRD$ = this.route.data.pipe(
      map((data) => data.collection)
    );
    this.logoRD$ = this.collectionRD$.pipe(
      map((rd: RemoteData<Collection>) => rd.payload),
      filter((collection: Collection) => hasValue(collection)),
      flatMap((collection: Collection) => collection.logo)
    );
    this.subs.push(
      this.route.queryParams.subscribe((params) => {
        this.metadata.processRemoteData(this.collectionRD$);
        const page = +params.page || this.paginationConfig.currentPage;
        const pageSize = +params.pageSize || this.paginationConfig.pageSize;
        const pagination = Object.assign({},
          this.paginationConfig,
          { currentPage: page, pageSize: pageSize }
        );
        this.updatePage({
          pagination: pagination,
          sort: this.sortConfig
        });
      })
    );
  }

  updatePage(searchOptions) {
    this.itemRD$ = this.searchService.search(
      new PaginatedSearchOptions({
        scope: this.collectionId,
        pagination: searchOptions.pagination,
        sort: searchOptions.sort,
        dsoType: DSpaceObjectType.ITEM
      })).pipe(toDSpaceObjectListRD()) as Observable<RemoteData<PaginatedList<Item>>>;
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

  isNotEmpty(object: any) {
    return isNotEmpty(object);
  }

  onPaginationChange(event) {
    this.updatePage({
      pagination: {
        currentPage: event.page,
        pageSize: event.pageSize
      },
      sort: {
        field: event.sortField,
        direction: event.sortDirection
      }
    })
  }
}
