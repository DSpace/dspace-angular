import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  InjectionToken,
  Input,
  OnInit
} from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, switchMap, tap, } from 'rxjs/operators';

import { PaginatedList } from '../core/data/paginated-list';
import { RemoteData } from '../core/data/remote-data';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { pushInOut } from '../shared/animations/push';
import { HostWindowService } from '../shared/host-window.service';
import { PaginatedSearchOptions } from '../shared/search/paginated-search-options.model';
import { SearchService } from '../core/shared/search/search.service';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { hasValue } from '../shared/empty.util';
import { getSucceededRemoteData } from '../core/shared/operators';
import { MyDSpaceResponseParsingService } from '../core/data/mydspace-response-parsing.service';
import { SearchConfigurationOption } from '../shared/search/search-switch-configuration/search-configuration-option.model';
import { RoleType } from '../core/roles/role-types';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { MyDSpaceConfigurationService } from './my-dspace-configuration.service';
import { ViewMode } from '../core/shared/view-mode.model';
import { MyDSpaceRequest } from '../core/data/request.models';
import { SearchResult } from '../shared/search/search-result.model';
import { Context } from '../core/shared/context.model';
import { followLink } from '../shared/utils/follow-link-config.model';
import { ClaimedTask } from '../core/tasks/models/claimed-task-object.model';

export const MYDSPACE_ROUTE = '/mydspace';
export const SEARCH_CONFIG_SERVICE: InjectionToken<SearchConfigurationService> = new InjectionToken<SearchConfigurationService>('searchConfigurationService');

/**
 * This component represents the whole mydspace page
 */
@Component({
  selector: 'ds-my-dspace-page',
  styleUrls: ['./my-dspace-page.component.scss'],
  templateUrl: './my-dspace-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [pushInOut],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: MyDSpaceConfigurationService
    }
  ]
})
export class MyDSpacePageComponent implements OnInit {

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch = true;

  /**
   * The list of available configuration options
   */
  configurationList$: Observable<SearchConfigurationOption[]>;

  /**
   * The current search results
   */
  resultsRD$: BehaviorSubject<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> = new BehaviorSubject(null);

  /**
   * The current paginated search options
   */
  searchOptions$: Observable<PaginatedSearchOptions>;

  /**
   * The current relevant scopes
   */
  scopeListRD$: Observable<DSpaceObject[]>;

  /**
   * Emits true if were on a small screen
   */
  isXsOrSm$: Observable<boolean>;

  /**
   * Subscription to unsubscribe from
   */
  sub: Subscription;

  /**
   * Variable for enumeration RoleType
   */
  roleTypeEnum = RoleType;

  /**
   * List of available view mode
   */
  viewModeList = [ViewMode.ListElement, ViewMode.DetailedListElement];

  /**
   * The current context of this page: workspace or workflow
   */
  context$: Observable<Context>;

  constructor(private service: SearchService,
              private sidebarService: SidebarService,
              private windowService: HostWindowService,
              @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: MyDSpaceConfigurationService) {
    this.isXsOrSm$ = this.windowService.isXsOrSm();
    this.service.setServiceOptions(MyDSpaceResponseParsingService, MyDSpaceRequest);
  }

  /**
   * Initialize available configuration list
   *
   * Listening to changes in the paginated search options
   * If something changes, update the search results
   *
   * Listen to changes in the scope
   * If something changes, update the list of scopes for the dropdown
   *
   * Listen to changes in the configuration
   * If something changes, update the current context
   */
  ngOnInit(): void {
    this.configurationList$ = this.searchConfigService.getAvailableConfigurationOptions();
    this.searchOptions$ = this.searchConfigService.paginatedSearchOptions;
    this.sub = this.searchOptions$.pipe(
      tap(() => this.resultsRD$.next(null)),
      switchMap((options: PaginatedSearchOptions) =>
        this.service.search<ClaimedTask>(options, undefined,
          followLink('workflowitem', undefined, followLink('item'), followLink('submitter')),
          followLink('owner')).pipe(getSucceededRemoteData())))
      .subscribe((results) => {
        this.resultsRD$.next(results);
      });

    this.scopeListRD$ = this.searchConfigService.getCurrentScope('').pipe(
      switchMap((scopeId) => this.service.getScopes(scopeId))
    );

    this.context$ = this.searchConfigService.getCurrentConfiguration('workspace')
      .pipe(
        map((configuration: string) => {
          if (configuration === 'workspace') {
            return Context.Workspace
          } else {
            return Context.Workflow
          }
        })
      );

  }

  /**
   * Set the sidebar to a collapsed state
   */
  public closeSidebar(): void {
    this.sidebarService.collapse()
  }

  /**
   * Set the sidebar to an expanded state
   */
  public openSidebar(): void {
    this.sidebarService.expand();
  }

  /**
   * Check if the sidebar is collapsed
   * @returns {Observable<boolean>} emits true if the sidebar is currently collapsed, false if it is expanded
   */
  public isSidebarCollapsed(): Observable<boolean> {
    return this.sidebarService.isCollapsed;
  }

  /**
   * @returns {string} The base path to the search page
   */
  public getSearchLink(): string {
    return this.service.getSearchLink();
  }

  /**
   * Unsubscribe from the subscription
   */
  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
