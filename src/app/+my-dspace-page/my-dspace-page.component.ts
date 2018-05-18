import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
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
import { PaginatedSearchOptions } from '../+search-page/paginated-search-options.model';
import { SearchFilterService } from '../+search-page/search-filters/search-filter/search-filter.service';
import { flatMap } from 'rxjs/operators';
import { MyDSpaceConfigurationType } from './mydspace-configuration-type';
import { MyDSpaceResponseParsingService } from '../core/data/mydspace-response-parsing.service';
import { RolesService } from '../core/roles/roles.service';
import { getAuthenticatedUser } from '../core/auth/selectors';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Eperson } from '../core/eperson/models/eperson.model';
import { hasValue, isEmpty, isNotEmpty, isNotNull } from '../shared/empty.util';
import { NavigationExtras, Router } from '@angular/router';

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
  hideOptions: boolean;
  resultsRD$: Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>>;
  searchOptions$: Observable<PaginatedSearchOptions>;
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

  constructor(private service: SearchService,
              private communityService: CommunityDataService,
              private sidebarService: SearchSidebarService,
              private windowService: HostWindowService,
              private filterService: SearchFilterService,
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

    this.user$ = this.store.select(getAuthenticatedUser);
    this.searchOptions$ = this.filterService.getPaginatedSearchOptions(this.defaults);

    this.sub = Observable.combineLatest(this.searchOptions$, this.isSubmitter$, this.isController$)
      .filter(([searchOptions, isSubmitter, isController]) => isNotEmpty(isSubmitter) && isNotEmpty(isController))
      .distinctUntilChanged()
      .subscribe(([searchOptions, isSubmitter, isController]) => {
        const configuration = this.getSearchConfiguration(searchOptions.configuration as MyDSpaceConfigurationType, isSubmitter, isController);
        if (isNotNull(configuration)) {
          this.resultsRD$ = this.service.search(searchOptions)
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

  private getAvailableConfiguration(isSubmitter: boolean, isController: boolean): MyDSpaceConfigurationType[] {
    const availableConf: MyDSpaceConfigurationType[] = [];
    if (isSubmitter || (!isSubmitter && !isController)) {
      availableConf.push(MyDSpaceConfigurationType.Workspace);
    }
    if (isController || (!isSubmitter && !isController)) {
      availableConf.push(MyDSpaceConfigurationType.Workflow);
    }
    return availableConf;
  }

  private getSearchConfiguration(configurationParam: MyDSpaceConfigurationType, isSubmitter: boolean, isController: boolean) {
    const configurationDefault: MyDSpaceConfigurationType = (isSubmitter || (!isSubmitter && !isController)) ?
      MyDSpaceConfigurationType.Workspace :
      MyDSpaceConfigurationType.Workflow;
    if (isEmpty(configurationParam) || !this.getAvailableConfiguration(isSubmitter, isController).includes(configurationParam)) {
      // If configuration param is empty or is not included in available configurations redirect to a default configuration value
      const navigationExtras: NavigationExtras = {
        queryParams: {configuration: configurationDefault},
        queryParamsHandling: 'merge'
      };

      this.router.navigate([MYDSPACE_ROUTE], navigationExtras);
      return null;
    } else {
      return configurationParam;
    }
  }

  ngOnDestroy() {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
