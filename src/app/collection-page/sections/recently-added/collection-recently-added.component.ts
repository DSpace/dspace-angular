import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Observable, combineLatest as observableCombineLatest } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { Item } from '../../../core/shared/item.model';
import { switchMap, map, startWith, take } from 'rxjs/operators';
import { getFirstSucceededRemoteData, toDSpaceObjectListRD } from '../../../core/shared/operators';
import { PaginatedSearchOptions } from '../../../shared/search/models/paginated-search-options.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { BROWSE_LINKS_TO_FOLLOW } from '../../../core/browse/browse.service';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { SortOptions, SortDirection } from '../../../core/cache/models/sort-options.model';
import { APP_CONFIG, AppConfig } from '../../../../config/app-config.interface';
import { SearchService } from '../../../core/shared/search/search.service';
import { Collection } from '../../../core/shared/collection.model';
import { ActivatedRoute, Data } from '@angular/router';
import { fadeIn } from '../../../shared/animations/fade';

@Component({
  selector: 'ds-collection-recently-added',
  templateUrl: './collection-recently-added.component.html',
  styleUrls: ['./collection-recently-added.component.scss'],
  animations: [fadeIn],
})
export class CollectionRecentlyAddedComponent implements OnInit, OnDestroy {

  paginationConfig: PaginationComponentOptions;

  sortConfig: SortOptions;

  collectionRD$: Observable<RemoteData<Collection>>;

  itemRD$: Observable<RemoteData<PaginatedList<Item>>>;

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    protected paginationService: PaginationService,
    protected route: ActivatedRoute,
    protected searchService: SearchService,
  ) {
    this.paginationConfig = Object.assign(new PaginationComponentOptions(), {
      id: 'cp',
      currentPage: 1,
      pageSize: this.appConfig.browseBy.pageSize,
    });

    this.sortConfig = new SortOptions('dc.date.accessioned', SortDirection.DESC);
  }

  ngOnInit(): void {
    this.collectionRD$ = this.route.data.pipe(
      map((data: Data) => data.dso as RemoteData<Collection>),
      take(1),
    );

    this.itemRD$ = observableCombineLatest([
      this.paginationService.getCurrentPagination(this.paginationConfig.id, this.paginationConfig),
      this.paginationService.getCurrentSort(this.paginationConfig.id, this.sortConfig),
    ]).pipe(
      switchMap(([currentPagination, currentSort]: [PaginationComponentOptions, SortOptions]) => this.collectionRD$.pipe(
        getFirstSucceededRemoteData(),
        map((rd: RemoteData<Collection>) => rd.payload.id),
        switchMap((id: string) => this.searchService.search<Item>(
          new PaginatedSearchOptions({
            scope: id,
            pagination: currentPagination,
            sort: currentSort,
            dsoTypes: [DSpaceObjectType.ITEM]
          }), null, true, true, ...BROWSE_LINKS_TO_FOLLOW).pipe(
          toDSpaceObjectListRD()
        ) as Observable<RemoteData<PaginatedList<Item>>>),
        startWith(undefined), // Make sure switching pages shows loading component
      )),
    );
  }

  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.paginationConfig.id);
  }

}
