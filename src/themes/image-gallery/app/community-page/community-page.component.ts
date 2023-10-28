import { ChangeDetectionStrategy, Component, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, combineLatest as observableCombineLatest } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { CommunityPageComponent as BaseComponent } from '../../../../app/community-page/community-page.component';
import { AuthService } from '../../../../app/core/auth/auth.service';
import { DSONameService } from '../../../../app/core/breadcrumbs/dso-name.service';
import { BROWSE_LINKS_TO_FOLLOW } from '../../../../app/core/browse/browse.service';
import { SortDirection, SortOptions } from '../../../../app/core/cache/models/sort-options.model';
import { CommunityDataService } from '../../../../app/core/data/community-data.service';
import { AuthorizationDataService } from '../../../../app/core/data/feature-authorization/authorization-data.service';
import { PaginatedList } from '../../../../app/core/data/paginated-list.model';
import { RemoteData } from '../../../../app/core/data/remote-data';
import { MetadataService } from '../../../../app/core/metadata/metadata.service';
import { PaginationService } from '../../../../app/core/pagination/pagination.service';
import { DSpaceObjectType } from '../../../../app/core/shared/dspace-object-type.model';
import { Item } from '../../../../app/core/shared/item.model';
import { getFirstSucceededRemoteData, toDSpaceObjectListRD } from '../../../../app/core/shared/operators';
import { SearchService } from '../../../../app/core/shared/search/search.service';
import { fadeInOut } from '../../../../app/shared/animations/fade';
import { PaginationComponentOptions } from '../../../../app/shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../../../app/shared/search/models/paginated-search-options.model';
import { APP_CONFIG, AppConfig } from '../../../../config/app-config.interface';

@Component({
  selector: 'ds-community-page',
  templateUrl: './community-page.component.html',
  // templateUrl: '../../../../app/community-page/community-page.component.html',
  // styleUrls: ['./community-page.component.scss'],
  styleUrls: ['../../../../app/community-page/community-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut]
})
/**
 * This component represents a detail page for a single community
 */
export class CommunityPageComponent extends BaseComponent implements OnDestroy {
  itemRD$: Observable<RemoteData<PaginatedList<Item>>>;
  paginationConfig: PaginationComponentOptions;
  sortConfig: SortOptions;
  private paginationChanges$: Subject<{
    paginationConfig: PaginationComponentOptions,
    sortConfig: SortOptions
  }>;

  constructor(
    private searchService: SearchService,
    private paginationService: PaginationService,
    communityDataService: CommunityDataService,
    metadata: MetadataService,
    route: ActivatedRoute,
    router: Router,
    authService: AuthService,
    authorizationDataService: AuthorizationDataService,
    dsoNameService: DSONameService,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
  ) {
    super(
      communityDataService,
      metadata,
      route,
      router,
      authService,
      authorizationDataService,
      dsoNameService
    );
    this.paginationConfig = Object.assign(new PaginationComponentOptions(), {
      id: 'cp',
      currentPage: 1,
      pageSize: this.appConfig.browseBy.pageSize,
    });

    this.sortConfig = new SortOptions('dc.date.accessioned', SortDirection.DESC);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.paginationChanges$ = new BehaviorSubject({
      paginationConfig: this.paginationConfig,
      sortConfig: this.sortConfig
    });

    const currentPagination$ = this.paginationService.getCurrentPagination(this.paginationConfig.id, this.paginationConfig);
    const currentSort$ = this.paginationService.getCurrentSort(this.paginationConfig.id, this.sortConfig);

    this.itemRD$ = observableCombineLatest([currentPagination$, currentSort$]).pipe(
      switchMap(([currentPagination, currentSort]) => this.communityRD$.pipe(
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
  }

  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.paginationConfig.id);
  }

}
