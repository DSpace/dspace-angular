import { ChangeDetectionStrategy, Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest as observableCombineLatest, Observable, Subject } from 'rxjs';
import { filter, map, mergeMap, startWith, switchMap, take } from 'rxjs/operators';
import { PaginatedSearchOptions } from '../shared/search/models/paginated-search-options.model';
import { SearchService } from '../core/shared/search/search.service';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { CollectionDataService } from '../core/data/collection-data.service';
import { PaginatedList } from '../core/data/paginated-list.model';
import { RemoteData } from '../core/data/remote-data';
import { Bitstream } from '../core/shared/bitstream.model';

import { Collection } from '../core/shared/collection.model';
import { DSpaceObjectType } from '../core/shared/dspace-object-type.model';
import { Item } from '../core/shared/item.model';
import {
  getAllSucceededRemoteDataPayload,
  getFirstSucceededRemoteData,
  toDSpaceObjectListRD
} from '../core/shared/operators';

import { fadeIn, fadeInOut } from '../shared/animations/fade';
import { hasValue, isNotEmpty } from '../shared/empty.util';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { AuthService } from '../core/auth/auth.service';
import { PaginationService } from '../core/pagination/pagination.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { getCollectionPageRoute } from './collection-page-routing-paths';
import { redirectOn4xx } from '../core/shared/authorized.operators';
import { BROWSE_LINKS_TO_FOLLOW } from '../core/browse/browse.service';
import { DSONameService } from '../core/breadcrumbs/dso-name.service';
import { APP_CONFIG, AppConfig } from '../../../src/config/app-config.interface';
import { ComcolPageContentComponent } from '../shared/comcol/comcol-page-content/comcol-page-content.component';
import { ErrorComponent } from '../shared/error/error.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { ThemedLoadingComponent } from '../shared/loading/themed-loading.component';
import { TranslateModule } from '@ngx-translate/core';
import { ViewTrackerComponent } from '../statistics/angulartics/dspace/view-tracker.component';
import { VarDirective } from '../shared/utils/var.directive';
import { ComcolPageHeaderComponent } from '../shared/comcol/comcol-page-header/comcol-page-header.component';
import { ComcolPageLogoComponent } from '../shared/comcol/comcol-page-logo/comcol-page-logo.component';
import {
  ThemedComcolPageHandleComponent
} from '../shared/comcol/comcol-page-handle/themed-comcol-page-handle.component';
import { DsoEditMenuComponent } from '../shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import {
  ThemedComcolPageBrowseByComponent
} from '../shared/comcol/comcol-page-browse-by/themed-comcol-page-browse-by.component';
import { ObjectCollectionComponent } from '../shared/object-collection/object-collection.component';

@Component({
  selector: 'ds-collection-page',
  styleUrls: ['./collection-page.component.scss'],
  templateUrl: './collection-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut
  ],
  imports: [
    ComcolPageContentComponent,
    ErrorComponent,
    NgIf,
    ThemedLoadingComponent,
    TranslateModule,
    ViewTrackerComponent,
    VarDirective,
    AsyncPipe,
    ComcolPageHeaderComponent,
    ComcolPageLogoComponent,
    ThemedComcolPageHandleComponent,
    DsoEditMenuComponent,
    ThemedComcolPageBrowseByComponent,
    ObjectCollectionComponent
  ],
  standalone: true
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
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private paginationService: PaginationService,
    private authorizationDataService: AuthorizationDataService,
    public dsoNameService: DSONameService,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
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

    const currentPagination$ = this.paginationService.getCurrentPagination(this.paginationConfig.id, this.paginationConfig);
    const currentSort$ = this.paginationService.getCurrentSort(this.paginationConfig.id, this.sortConfig);

    this.itemRD$ = observableCombineLatest([currentPagination$, currentSort$]).pipe(
      switchMap(([currentPagination, currentSort]) => this.collectionRD$.pipe(
        getFirstSucceededRemoteData(),
        map((rd) => rd.payload.id),
        switchMap((id: string) => {
          return this.searchService.search<Item>(
            new PaginatedSearchOptions({
              scope: id,
              pagination: currentPagination,
              sort: currentSort,
              dsoTypes: [DSpaceObjectType.ITEM]
            }), null, true, true, ...BROWSE_LINKS_TO_FOLLOW)
            .pipe(toDSpaceObjectListRD()) as Observable<RemoteData<PaginatedList<Item>>>;
        }),
        startWith(undefined) // Make sure switching pages shows loading component
      )
      )
    );

    this.collectionPageRoute$ = this.collectionRD$.pipe(
      getAllSucceededRemoteDataPayload(),
      map((collection) => getCollectionPageRoute(collection.id))
    );
  }

  isNotEmpty(object: any) {
    return isNotEmpty(object);
  }

  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.paginationConfig.id);
  }


}
