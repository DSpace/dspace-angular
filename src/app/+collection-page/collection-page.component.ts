import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of as observableOf, Observable, Subject } from 'rxjs';
import { filter, flatMap, map, startWith, switchMap, take, tap } from 'rxjs/operators';
import { PaginatedSearchOptions } from '../shared/search/paginated-search-options.model';
import { SearchService } from '../core/shared/search/search.service';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { CollectionDataService } from '../core/data/collection-data.service';
import { PaginatedList } from '../core/data/paginated-list';
import { RemoteData } from '../core/data/remote-data';

import { MetadataService } from '../core/metadata/metadata.service';
import { Bitstream } from '../core/shared/bitstream.model';

import { Collection } from '../core/shared/collection.model';
import { DSpaceObjectType } from '../core/shared/dspace-object-type.model';
import { Item } from '../core/shared/item.model';
import {
  getSucceededRemoteData,
  redirectToPageNotFoundOn404,
  toDSpaceObjectListRD
} from '../core/shared/operators';

import { fadeIn, fadeInOut } from '../shared/animations/fade';
import { hasNoValue, hasValue, isNotEmpty } from '../shared/empty.util';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';

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
export class CollectionPageComponent implements OnInit {
  collectionRD$: Observable<RemoteData<Collection>>;
  itemRD$: Observable<RemoteData<PaginatedList<Item>>>;
  logoRD$: Observable<RemoteData<Bitstream>>;
  paginationConfig: PaginationComponentOptions;
  sortConfig: SortOptions;
  private paginationChanges$: Subject<{
    paginationConfig: PaginationComponentOptions,
    sortConfig: SortOptions
  }>;

  constructor(
    private collectionDataService: CollectionDataService,
    private searchService: SearchService,
    private metadata: MetadataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.paginationConfig = new PaginationComponentOptions();
    this.paginationConfig.id = 'collection-page-pagination';
    this.paginationConfig.pageSize = 5;
    this.paginationConfig.currentPage = 1;
    this.sortConfig = new SortOptions('dc.date.accessioned', SortDirection.DESC);
  }

  ngOnInit(): void {
    this.collectionRD$ = this.route.data.pipe(
      map((data) => data.dso as RemoteData<Collection>),
      redirectToPageNotFoundOn404(this.router),
      take(1)
    );
    this.logoRD$ = this.collectionRD$.pipe(
      map((rd: RemoteData<Collection>) => rd.payload),
      filter((collection: Collection) => hasValue(collection)),
      flatMap((collection: Collection) => collection.logo)
    );

    this.paginationChanges$ = new BehaviorSubject({
      paginationConfig: this.paginationConfig,
      sortConfig: this.sortConfig
    });

    this.itemRD$ = this.paginationChanges$.pipe(
      switchMap((dto) => this.collectionRD$.pipe(
        getSucceededRemoteData(),
        map((rd) => rd.payload.id),
        switchMap((id: string) => {
          return this.searchService.search(
              new PaginatedSearchOptions({
                scope: id,
                pagination: dto.paginationConfig,
                sort: dto.sortConfig,
                dsoTypes: [DSpaceObjectType.ITEM]
              })).pipe(toDSpaceObjectListRD()) as Observable<RemoteData<PaginatedList<Item>>>
        }),
        startWith(undefined) // Make sure switching pages shows loading component
        )
      )
    );

    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      this.metadata.processRemoteData(this.collectionRD$);
      this.onPaginationChange(params);
    })
  }

  isNotEmpty(object: any) {
    return isNotEmpty(object);
  }

  onPaginationChange(event) {
    this.paginationConfig.currentPage = +event.page || this.paginationConfig.currentPage;
    this.paginationConfig.pageSize = +event.pageSize || this.paginationConfig.pageSize;
    this.sortConfig.direction = event.sortDirection || this.sortConfig.direction;
    this.sortConfig.field = event.sortField || this.sortConfig.field;

    this.paginationChanges$.next({
      paginationConfig: this.paginationConfig,
      sortConfig: this.sortConfig
    });
  }
}
