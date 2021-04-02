import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map, mergeMap, startWith, switchMap, take } from 'rxjs/operators';
import { PaginatedSearchOptions } from '../shared/search/paginated-search-options.model';
import { SearchService } from '../core/shared/search/search.service';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { CollectionDataService } from '../core/data/collection-data.service';
import { PaginatedList } from '../core/data/paginated-list.model';
import { RemoteData } from '../core/data/remote-data';

import { MetadataService } from '../core/metadata/metadata.service';
import { Bitstream } from '../core/shared/bitstream.model';

import { Collection } from '../core/shared/collection.model';
import { DSpaceObjectType } from '../core/shared/dspace-object-type.model';
import { Item } from '../core/shared/item.model';
import {
  getAllSucceededRemoteDataPayload,
  getFirstSucceededRemoteData,
  redirectOn4xx,
  toDSpaceObjectListRD
} from '../core/shared/operators';

import { fadeIn, fadeInOut } from '../shared/animations/fade';
import { hasValue, isNotEmpty } from '../shared/empty.util';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { AuthService } from '../core/auth/auth.service';
import {PaginationChangeEvent} from '../shared/pagination/paginationChangeEvent.interface';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { getCollectionPageRoute } from './collection-page-routing-paths';

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

  /**
   * Whether the current user is a Community admin
   */
  isCollectionAdmin$: Observable<boolean>;

  /**
   * Route to the community page
   */
  collectionPageRoute$: Observable<string>;

  constructor(
    private collectionDataService: CollectionDataService,
    private searchService: SearchService,
    private metadata: MetadataService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private authorizationDataService: AuthorizationDataService,
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
      redirectOn4xx(this.router, this.authService),
      take(1)
    );
    this.logoRD$ = this.collectionRD$.pipe(
      map((rd: RemoteData<Collection>) => rd.payload),
      filter((collection: Collection) => hasValue(collection)),
      mergeMap((collection: Collection) => collection.logo)
    );
    this.isCollectionAdmin$ = this.authorizationDataService.isAuthorized(FeatureID.IsCollectionAdmin);

    this.paginationChanges$ = new BehaviorSubject({
      paginationConfig: this.paginationConfig,
      sortConfig: this.sortConfig
    });

    this.itemRD$ = this.paginationChanges$.pipe(
      switchMap((dto) => this.collectionRD$.pipe(
        getFirstSucceededRemoteData(),
        map((rd) => rd.payload.id),
        switchMap((id: string) => {
          return this.searchService.search(
              new PaginatedSearchOptions({
                scope: id,
                pagination: dto.paginationConfig,
                sort: dto.sortConfig,
                dsoTypes: [DSpaceObjectType.ITEM]
              })).pipe(toDSpaceObjectListRD()) as Observable<RemoteData<PaginatedList<Item>>>;
        }),
        startWith(undefined) // Make sure switching pages shows loading component
        )
      )
    );

    this.collectionPageRoute$ = this.collectionRD$.pipe(
      getAllSucceededRemoteDataPayload(),
      map((collection) => getCollectionPageRoute(collection.id))
    );

    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      this.metadata.processRemoteData(this.collectionRD$);
    });
  }

  isNotEmpty(object: any) {
    return isNotEmpty(object);
  }

  onPaginationChange(event: PaginationChangeEvent) {
    this.paginationConfig = Object.assign(new PaginationComponentOptions(), {
      currentPage: event.pagination.currentPage || this.paginationConfig.currentPage,
      pageSize: event.pagination.pageSize || this.paginationConfig.pageSize,
      id: 'collection-page-pagination'
    });
    this.sortConfig = Object.assign(new SortOptions('dc.date.accessioned', SortDirection.DESC), {
      direction: event.sort.direction || this.sortConfig.direction,
      field: event.sort.field || this.sortConfig.field
    });
    this.paginationChanges$.next({
      paginationConfig: this.paginationConfig,
      sortConfig: this.sortConfig
    });
  }
}
