import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, flatMap, map, take } from 'rxjs/operators';
import { PaginatedSearchOptions } from '../+search-page/paginated-search-options.model';
import { SearchService } from '../+search-page/search-service/search.service';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { CollectionDataService } from '../core/data/collection-data.service';
import { PaginatedList } from '../core/data/paginated-list';
import { RemoteData } from '../core/data/remote-data';

import { MetadataService } from '../core/metadata/metadata.service';
import { Bitstream } from '../core/shared/bitstream.model';

import { Collection } from '../core/shared/collection.model';
import { DSpaceObjectType } from '../core/shared/dspace-object-type.model';
import { Item } from '../core/shared/item.model';
import { getSucceededRemoteData, toDSpaceObjectListRD } from '../core/shared/operators';

import { fadeIn, fadeInOut } from '../shared/animations/fade';
import { hasValue, isNotEmpty } from '../shared/empty.util';
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
export class CollectionPageComponent implements OnInit, OnDestroy {
  collectionRD$: Observable<RemoteData<Collection>>;
  itemRD$: Observable<RemoteData<PaginatedList<Item>>>;
  logoRD$: Observable<RemoteData<Bitstream>>;
  paginationConfig: PaginationComponentOptions;
  sortConfig: SortOptions;
  private subs: Subscription[] = [];
  private collectionId: string;
  private currentPage: number;
  private pageSize: number;

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
      map((data) => data.collection),
      take(1)
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

        this.collectionRD$.subscribe((rd: RemoteData<Collection>) => {
          this.collectionId = rd.payload.id;
          this.updatePage(page, pageSize);
        });
      })
    );
  }

  updatePage(currentPage: number, pageSize: number) {
    this.itemRD$ = this.searchService.search(
      new PaginatedSearchOptions({
        scope: this.collectionId,
        pagination: {
          currentPage,
          pageSize
        } as PaginationComponentOptions,
        sort: this.sortConfig,
        dsoType: DSpaceObjectType.ITEM
      })).pipe(
      toDSpaceObjectListRD(),
      getSucceededRemoteData(),
      take(1),
    ) as Observable<RemoteData<PaginatedList<Item>>>;

    this.currentPage = currentPage;
    this.pageSize = pageSize;
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

  isNotEmpty(object: any) {
    return isNotEmpty(object);
  }

  onPaginationChange(event) {
    if (this.currentPage !== event.page || this.pageSize !== event.pageSize) {
      this.updatePage(event.page, event.pageSize);
    }
  }
}
