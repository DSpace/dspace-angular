import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { findIndex } from 'lodash';

import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { CommunityDataService } from '../core/data/community-data.service';
import { PaginatedList } from '../core/data/paginated-list';
import { RemoteData } from '../core/data/remote-data';
import { Community } from '../core/shared/community.model';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { pushInOut } from '../shared/animations/push';
import { HostWindowService } from '../shared/host-window.service';
import { SearchResult } from '../+search-page/search-result.model';
import { SearchService } from '../+search-page/search-service/search.service';
import { SearchSidebarService } from '../+search-page/search-sidebar/search-sidebar.service';
import { SearchFilterService } from '../+search-page/search-filters/search-filter/search-filter.service';
import { MyDSpaceConfigurationType } from './mydspace-configuration-type';
import { MyDSpaceResponseParsingService } from '../core/data/mydspace-response-parsing.service';
import { RolesService } from '../core/roles/roles.service';
import { getAuthenticatedUser } from '../core/auth/selectors';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Eperson } from '../core/eperson/models/eperson.model';
import { hasValue, isEmpty, isNotEmpty, isNotNull } from '../shared/empty.util';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ViewMode } from '../+search-page/search-options.model';
import { SearchConfigOption } from '../+search-page/search-filters/search-switch-config/search-config-option.model';
import { PaginatedSearchOptions } from '../+search-page/paginated-search-options.model';

export const MYDSPACE_ROUTE = '/mydspace';

@Component({
  selector: 'ds-my-dspace-page',
  styleUrls: ['./my-dspace-page.component.scss'],
  templateUrl: './my-dspace-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [pushInOut]
})
export class MyDSpacePageComponent implements OnDestroy, OnInit {

  private sub;
  private scope: string;

  configuration: MyDSpaceConfigurationType;
  configurationList$: Observable<SearchConfigOption[]>;
  hideOptions: boolean;
  resultsRD$: Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>>;
  searchOptions$: Observable<any>;
  sortConfig: SortOptions;
  scopeListRD$: Observable<RemoteData<PaginatedList<Community>>>;
  isMobileView$: Observable<boolean>;
  isController$: Observable<boolean>;
  isSubmitter$: Observable<boolean>;
  pageSize;
  pageSizeOptions;
  defaults = {
    pagination: {
      id: 'mydspace-results-pagination',
      pageSize: 10
    },
    sort: new SortOptions('score', SortDirection.DESC),
    configuration: '',
    query: '',
    scope: ''
  };
  user$: Observable<Eperson>;
  viewModeList = [ViewMode.List, ViewMode.Detail];

  constructor(private cdr: ChangeDetectorRef,
              private service: SearchService,
              private communityService: CommunityDataService,
              private sidebarService: SearchSidebarService,
              private windowService: HostWindowService,
              private filterService: SearchFilterService,
              private route: ActivatedRoute,
              private router: Router,
              private store: Store<AppState>,
              public rolesService: RolesService) {
    this.isMobileView$ = Observable.combineLatest(
      this.windowService.isXs(),
      this.windowService.isSm(),
      ((isXs, isSm) => isXs || isSm)
    );
    this.scopeListRD$ = communityService.findAll();
    this.isSubmitter$ = this.rolesService.isSubmitter();
    this.isController$ = this.rolesService.isController();
  }

  ngOnInit(): void {
    this.service.setServiceOptions(MyDSpaceResponseParsingService, true);
    this.hideOptions = true;

    this.configurationList$ = Observable.combineLatest(this.isSubmitter$, this.isController$)
      .filter(([isSubmitter, isController]) => isNotEmpty(isSubmitter) && isNotEmpty(isController))
      .first()
      .map(([isSubmitter, isController]) => {
        return this.getMyDSpaceConfigurationOptions(isSubmitter, isController);
      });

    this.user$ = this.store.select(getAuthenticatedUser);

    this.searchOptions$ = this.filterService.getCurrentView()
      .distinctUntilChanged()
      .flatMap((currentView) => {
        if (isNotEmpty(currentView) && currentView === ViewMode.Detail) {
          this.defaults.pagination.pageSize = 1;
        }
        return this.filterService.getPaginatedSearchOptions(this.defaults);
      });

    this.sub = Observable.combineLatest(this.searchOptions$, this.configurationList$)
      .distinctUntilChanged()
      .subscribe(([searchOptions, configurationList]) => {
        if (this.validateConfigurationParam(searchOptions, configurationList)) {
          this.resultsRD$ = this.service.search(searchOptions);
        }
      });
  }

  public closeSidebar(): void {
    this.sidebarService.collapse()
  }

  public openSidebar(): void {
    this.sidebarService.expand();
  }

  public isSidebarCollapsed(): Observable<boolean> {
    return this.sidebarService.isCollapsed;
  }

  public getSearchLink(): string {
    return this.service.getSearchLink();
  }

  private getMyDSpaceConfigurationOptions(isSubmitter: boolean, isController: boolean): SearchConfigOption[] {
    const configurationOptions: SearchConfigOption[] = [];
    if (isSubmitter || (!isSubmitter && !isController)) {
      const value = MyDSpaceConfigurationType.Workspace;
      const label = `mydspace.show.${value}`;
      configurationOptions.push({value, label})
    }
    if (isController || (!isSubmitter && !isController)) {
      const value = MyDSpaceConfigurationType.Workflow;
      const label = `mydspace.show.${value}`;
      configurationOptions.push({value, label})
    }
    return configurationOptions;
  }

  private validateConfigurationParam(searchOptions: PaginatedSearchOptions, configurationList: SearchConfigOption[]): boolean {
    const configurationDefault: MyDSpaceConfigurationType = configurationList[0].value as MyDSpaceConfigurationType;
    if (isEmpty(searchOptions.configuration) || findIndex(configurationList, {value: searchOptions.configuration}) === -1) {
      // If configuration param is empty or is not included in available configurations redirect to a default configuration value
      const navigationExtras: NavigationExtras = {
        queryParams: {configuration: configurationDefault},
        queryParamsHandling: 'merge'
      };

      // override the route reuse strategy
      this.router.routeReuseStrategy.shouldReuseRoute = () => {
        return false;
      };
      this.router.navigated = false;
      this.router.navigate([MYDSPACE_ROUTE], navigationExtras);
      this.cdr.detectChanges();
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
    this.user$ = null;
    this.searchOptions$ = null;
  }
}
