import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { CollectionDataService } from '../core/data/collection-data.service';
import { ItemDataService } from '../core/data/item-data.service';
import { PaginatedList } from '../core/data/paginated-list';
import { RemoteData } from '../core/data/remote-data';

import { MetadataService } from '../core/metadata/metadata.service';
import { Bitstream } from '../core/shared/bitstream.model';

import { Collection } from '../core/shared/collection.model';
import { Item } from '../core/shared/item.model';

import { fadeIn, fadeInOut } from '../shared/animations/fade';
import { hasValue, isNotEmpty } from '../shared/empty.util';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { filter, first, flatMap, map, switchMap } from 'rxjs/operators';
import { PaginatedSearchOptions } from '../+search-page/paginated-search-options.model';
import { getSucceededRemoteData, redirectToPageNotFoundOn404 } from '../core/shared/operators';

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

  constructor(
    private collectionDataService: CollectionDataService,
    private itemDataService: ItemDataService,
    private metadata: MetadataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.paginationConfig = new PaginationComponentOptions();
    this.paginationConfig.id = 'collection-page-pagination';
    this.paginationConfig.pageSize = 5;
    this.paginationConfig.currentPage = 1;
    this.sortConfig = new SortOptions('dc.date.issued', SortDirection.DESC);
  }

  ngOnInit(): void {
    this.collectionRD$ = this.route.data.pipe(
      map((data) => data.collection as RemoteData<Collection>),
      redirectToPageNotFoundOn404(this.router),
      first()
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
        const sortDirection = +params.page || this.sortConfig.direction;
        const pagination = Object.assign({},
          this.paginationConfig,
          { currentPage: page, pageSize: pageSize }
        );
        const sort = Object.assign({},
          this.sortConfig,
          { direction: sortDirection, field: this.sortConfig.field }
        );
        this.updatePage({
          pagination: pagination,
          sort: sort
        });
      })
    );
  }

  updatePage(searchOptions) {
    this.itemRD$ = this.collectionRD$.pipe(
      getSucceededRemoteData(),
      map((rd) => rd.payload.id),
      switchMap((id: string) => {
        return this.itemDataService.findAll(
          new PaginatedSearchOptions({
            scope: id,
            currentPage: searchOptions.pagination.currentPage,
            elementsPerPage: searchOptions.pagination.pageSize,
            sort: searchOptions.sort
          }));
      })
    )
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
