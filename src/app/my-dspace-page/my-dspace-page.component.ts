import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  take,
  tap,
} from 'rxjs/operators';

import { MyDSpaceResponseParsingService } from '../core/data/mydspace-response-parsing.service';
import { MyDSpaceRequest } from '../core/data/request.models';
import { RequestService } from '../core/data/request.service';
import { RoleType } from '../core/roles/role-types';
import { Context } from '../core/shared/context.model';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { SearchService } from '../core/shared/search/search.service';
import { ViewMode } from '../core/shared/view-mode.model';
import { SuggestionsNotificationComponent } from '../notifications/suggestions-notification/suggestions-notification.component';
import { ClaimedTaskSearchResult } from '../shared/object-collection/shared/claimed-task-search-result.model';
import { PoolTaskSearchResult } from '../shared/object-collection/shared/pool-task-search-result.model';
import { SelectableListService } from '../shared/object-list/selectable-list/selectable-list.service';
import { RoleDirective } from '../shared/roles/role.directive';
import { SearchResult } from '../shared/search/models/search-result.model';
import { SearchConfigurationOption } from '../shared/search/search-switch-configuration/search-configuration-option.model';
import { ThemedSearchComponent } from '../shared/search/themed-search.component';
import {
  MyDSpaceConfigurationService,
  SEARCH_CONFIG_SERVICE,
} from './my-dspace-configuration.service';
import { MyDSpaceConfigurationValueType } from './my-dspace-configuration-value-type';
import { MyDSpaceBulkActionComponent } from './my-dspace-new-submission/my-dspace-bulk-action/my-dspace-bulk-action.component';
import { MyDSpaceNewBulkImportComponent } from './my-dspace-new-submission/my-dspace-new-bulk-import/my-dspace-new-bulk-import.component';
import { MyDSpaceNewSubmissionComponent } from './my-dspace-new-submission/my-dspace-new-submission.component';
import { MyDspaceQaEventsNotificationsComponent } from './my-dspace-qa-events-notifications/my-dspace-qa-events-notifications.component';

/**
 * This component represents the whole mydspace page
 */
@Component({
  selector: 'ds-base-my-dspace-page',
  styleUrls: ['./my-dspace-page.component.scss'],
  templateUrl: './my-dspace-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: MyDSpaceConfigurationService,
    },
  ],
  imports: [
    ThemedSearchComponent,
    MyDSpaceNewSubmissionComponent,
    AsyncPipe,
    RoleDirective,
    NgIf,
    SuggestionsNotificationComponent,
    MyDspaceQaEventsNotificationsComponent,
    MyDSpaceNewBulkImportComponent,
    MyDSpaceBulkActionComponent,
  ],
  standalone: true,
})
export class MyDSpacePageComponent implements OnInit {

  /**
   * The list of available configuration options
   */
  configurationList$: Observable<SearchConfigurationOption[]>;
  /**
   * The current configuration option
   */
  currentConfiguration$: Observable<string>;
  /**
   * The start context to use in the search: workspace or workflow
   */
  context = signal<Context>(null);

  /**
   * The start configuration to use in the search: workspace or workflow
   */
  configuration = signal<string>(null);

  /**
   * Variable for enumeration RoleType
   */
  roleTypeEnum = RoleType;


  /**
   * List of available view mode
   */
  viewModeList = [ViewMode.ListElement, ViewMode.DetailedListElement];

  public readonly workflowType = MyDSpaceConfigurationValueType.Workflow;

  /**
   * List Id for item selection
   */
  listId = 'mydspace_selection_' + this.workflowType;

  constructor(
    protected router: Router,
    protected requestService: RequestService,
    protected service: SearchService,
    protected selectableListService: SelectableListService,
    @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: MyDSpaceConfigurationService,
  ) {
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

    this.configurationList$.pipe(take(1)).subscribe((configurationList: SearchConfigurationOption[]) => {
      this.configuration.set(configurationList[0].value);
      this.context.set(configurationList[0].context);
    });

    this.currentConfiguration$ = this.searchConfigService.getCurrentConfiguration('');
  }

  /**
   * Add object to selection list
   * @param task
   */
  onDeselectObject(task: PoolTaskSearchResult | ClaimedTaskSearchResult) {
    this.selectableListService.deselectSingle(this.listId, task);

  }

  /**
   * Deselect object from selection list
   * @param task
   */
  onSelectObject(task: PoolTaskSearchResult | ClaimedTaskSearchResult) {
    this.selectableListService.selectSingle(this.listId, task);
  }

  /**
   * Refresh current page
   */
  refreshData(searchResult: SearchResult<DSpaceObject>[]) {
    if (searchResult?.length > 0) {
      // We use the same logic as the workspace action component as the search component need the cache to be emptied and the page to be reloaded
      this.router.navigated = false;
      const url = decodeURIComponent(this.router.url);
      // override the route reuse strategy
      this.router.routeReuseStrategy.shouldReuseRoute = () => {
        return false;
      };
      // This assures that the search cache is empty before reloading mydspace.
      this.service.getEndpoint().pipe(
        take(1),
        tap((cachedHref: string) => this.requestService.removeByHrefSubstring(cachedHref)),
      ).subscribe(() => this.router.navigateByUrl(url));
    }
  }
}
