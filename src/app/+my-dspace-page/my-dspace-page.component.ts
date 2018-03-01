import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SortOptions } from '../core/cache/models/sort-options.model';
import { CommunityDataService } from '../core/data/community-data.service';
import { PaginatedList } from '../core/data/paginated-list';
import { RemoteData } from '../core/data/remote-data';
import { Community } from '../core/shared/community.model';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { pushInOut } from '../shared/animations/push';
import { hasValue, isNotEmpty, isNotUndefined } from '../shared/empty.util';
import { HostWindowService } from '../shared/host-window.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { SearchOptions, ViewMode } from '../+search-page/search-options.model';
import { SearchResult } from '../+search-page/search-result.model';
import { SearchService } from '../+search-page/search-service/search.service';
import { SearchSidebarService } from '../+search-page/search-sidebar/search-sidebar.service';
import { MyDSpaceResult } from './my-dspace-result.model';
import { MyDspaceService } from './my-dspace-service/my-dspace.service';
import { getAuthenticatedUser } from '../core/auth/selectors';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { Eperson } from '../core/eperson/models/eperson.model';
import { PlatformService } from '../shared/services/platform.service';
import { Workspaceitem } from '../core/submission/models/workspaceitem.model';
import { WorkspaceitemMyDSpaceResult } from '../shared/object-collection/shared/workspaceitem-my-dspace-result.model';
import { Subject } from 'rxjs/Subject';
import { Metadatum } from '../core/shared/metadatum.model';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-my-dspace-page',
  styleUrls: ['./my-dspace-page.component.scss'],
  templateUrl: './my-dspace-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [pushInOut]
})
export class MyDSpacePageComponent implements OnInit, OnDestroy {

  private sub;
  private scope: string;

  query: string;
  scopeObjectRDObs: Observable<RemoteData<DSpaceObject>>;
  resultsRDObs: Observable<RemoteData<Array<MyDSpaceResult<DSpaceObject>>>>;
  currentParams = {};
  searchOptions: SearchOptions;
  sortConfig: SortOptions;
  scopeListRDObs: Observable<RemoteData<PaginatedList<Community>>>;
  isMobileView: Observable<boolean>;
  user: Observable<Eperson>;

  constructor(private service: MyDspaceService,
              private route: ActivatedRoute,
              private communityService: CommunityDataService,
              private platform: PlatformService,
              private sidebarService: SearchSidebarService,
              private store: Store<AppState>,
              private windowService: HostWindowService) {
    this.isMobileView = Observable.combineLatest(
      this.windowService.isXs(),
      this.windowService.isSm(),
      ((isXs, isSm) => isXs || isSm)
    );
    this.scopeListRDObs = communityService.findAll();
    // Initial pagination config
    const pagination: PaginationComponentOptions = new PaginationComponentOptions();
    pagination.id = 'mydspace-results-pagination';
    pagination.currentPage = 1;
    pagination.pageSize = 10;

    const sort: SortOptions = new SortOptions();
    this.sortConfig = sort;
    this.searchOptions = this.service.searchOptions;
  }

  ngOnInit(): void {
    this.user = this.store.select(getAuthenticatedUser);

    this.sub = this.route
      .queryParams
      .subscribe((params) => {
          // Save current parameters
          this.currentParams = params;
          this.query = params.query || '';
          this.scope = params.scope;
          const page = +params.page || this.searchOptions.pagination.currentPage;
          let pageSize = +params.pageSize || this.searchOptions.pagination.pageSize;
          let pageSizeOptions: number[] = [5, 10, 20];

          if (isNotEmpty(params.view) && params.view === ViewMode.Grid) {
            pageSizeOptions = [1];
            if (pageSizeOptions.indexOf(pageSize) === -1) {
              pageSize = 1;
            }
          }
          if (isNotEmpty(params.view) && params.view === ViewMode.List) {
            if (pageSizeOptions.indexOf(pageSize) === -1) {
              pageSize = 10;
            }
          }

          const sortDirection = +params.sortDirection || this.searchOptions.sort.direction;
          const pagination = Object.assign({},
            this.searchOptions.pagination,
            {currentPage: page, pageSize: pageSize, pageSizeOptions: pageSizeOptions}
          );
          const sort = Object.assign({},
            this.searchOptions.sort,
            {direction: sortDirection, field: params.sortField}
          );

          this.updateSearchResults({
            pagination: pagination,
            sort: sort
          });
          if (isNotEmpty(this.scope)) {
            this.scopeObjectRDObs = this.communityService.findById(this.scope);
          } else {
            this.scopeObjectRDObs = Observable.of(undefined);
          }
        }
      );

  }

  private updateSearchResults(searchOptions) {
    this.resultsRDObs = this.service.search(this.query, this.scope, searchOptions);
  }

  ngOnDestroy() {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }

  public closeSidebar(): void {
    this.sidebarService.collapse();
  }

  public openSidebar(): void {
    this.sidebarService.expand();
  }

  public isSidebarCollapsed(): Observable<boolean> {
    return this.sidebarService.isCollapsed;
  }

  public newSubmissionsEnd(workspaceitems: Workspaceitem[]) {
    this.resultsRDObs = this.resultsRDObs
      .filter((rd) => rd.hasSucceeded)
      .map((rd: RemoteData<Array<MyDSpaceResult<DSpaceObject>>>) => {
        const page = (rd.payload as any).page;
        const pageInfo = (rd.payload as any).pageInfo;
        const totalElements = (rd.payload as any).totalElements;
        workspaceitems.forEach((item: Workspaceitem, index) => {
          const mockResult: MyDSpaceResult<DSpaceObject> = new WorkspaceitemMyDSpaceResult();
          mockResult.dspaceObject = item;
          const highlight = new Metadatum();
          mockResult.hitHighlights = new Array(highlight);
          page.splice(index, 1, mockResult);
        });
        const payload = {
          page,
          pageInfo,
          totalElements
        };
        return Object.assign({}, rd, {payload});
        // return new RemoteData(false, false, true, undefined, payload as Array<MyDSpaceResult>);
      });
  }
}
