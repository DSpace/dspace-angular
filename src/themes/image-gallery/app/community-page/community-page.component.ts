import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import {
  map,
  startWith,
  switchMap
} from 'rxjs/operators';
import { CommunityPageComponent as BaseComponent } from '../../../../app/community-page/community-page.component';
import { AuthService } from '../../../../app/core/auth/auth.service';
import { DSONameService } from '../../../../app/core/breadcrumbs/dso-name.service';
import { getBrowseLinksToFollow } from '../../../../app/core/browse/browse.service';
import { SortDirection, SortOptions } from '../../../../app/core/cache/models/sort-options.model';
import { AuthorizationDataService } from '../../../../app/core/data/feature-authorization/authorization-data.service';
import { PaginatedList } from '../../../../app/core/data/paginated-list.model';
import { RemoteData } from '../../../../app/core/data/remote-data';
import { PaginationService } from '../../../../app/core/pagination/pagination.service';
import { DSpaceObjectType } from '../../../../app/core/shared/dspace-object-type.model';
import { Item } from '../../../../app/core/shared/item.model';
import { getFirstSucceededRemoteData, toDSpaceObjectListRD } from '../../../../app/core/shared/operators';
import { SearchService } from '../../../../app/core/shared/search/search.service';
import { fadeInOut } from '../../../../app/shared/animations/fade';
import { ThemedComcolPageBrowseByComponent } from '../../../../app/shared/comcol/comcol-page-browse-by/themed-comcol-page-browse-by.component';
import { ThemedComcolPageContentComponent } from '../../../../app/shared/comcol/comcol-page-content/themed-comcol-page-content.component';
import { ThemedComcolPageHandleComponent } from '../../../../app/shared/comcol/comcol-page-handle/themed-comcol-page-handle.component';
import { ComcolPageHeaderComponent } from '../../../../app/shared/comcol/comcol-page-header/comcol-page-header.component';
import { ComcolPageLogoComponent } from '../../../../app/shared/comcol/comcol-page-logo/comcol-page-logo.component';
import { DsoEditMenuComponent } from '../../../../app/shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { ErrorComponent } from '../../../../app/shared/error/error.component';
import { ThemedLoadingComponent } from '../../../../app/shared/loading/themed-loading.component';
import { ObjectGridComponent } from '../../../../app/shared/object-grid/object-grid.component';
import { PaginationComponentOptions } from '../../../../app/shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../../../app/shared/search/models/paginated-search-options.model';
import { VarDirective } from '../../../../app/shared/utils/var.directive';
import { APP_CONFIG, AppConfig } from '../../../../config/app-config.interface';
import { CommunityListComponent } from '../community-list-page/community-list/community-list.component';

@Component({
  selector: 'ds-base-community-page',
  styleUrls: ['./community-page.component.scss'],
  templateUrl: './community-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut],
  imports: [
    AsyncPipe,
    ComcolPageHeaderComponent,
    ComcolPageLogoComponent,
    CommunityListComponent,
    DsoEditMenuComponent,
    ErrorComponent,
    ObjectGridComponent,
    RouterModule,
    RouterOutlet,
    ThemedComcolPageBrowseByComponent,
    ThemedComcolPageContentComponent,
    ThemedComcolPageHandleComponent,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
  standalone: true,
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
    private readonly searchService: SearchService,
    private readonly paginationService: PaginationService,
    route: ActivatedRoute,
    router: Router,
    authService: AuthService,
    authorizationDataService: AuthorizationDataService,
    public dsoNameService: DSONameService,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
  ) {
    super(
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

    this.itemRD$ = combineLatest([currentPagination$, currentSort$]).pipe(
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
            }), null, true, true, ...getBrowseLinksToFollow())
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
