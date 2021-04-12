import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map, switchMap, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { SortDirection, SortOptions, } from '../core/cache/models/sort-options.model';
import { PaginatedList } from '../core/data/paginated-list.model';
import { RemoteData } from '../core/data/remote-data';
import { getFirstSucceededRemoteDataPayload, redirectOn4xx } from '../core/shared/operators';
import { SuggestionBulkResult, SuggestionsService } from '../openaire/reciter-suggestions/suggestions.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { OpenaireSuggestion } from '../core/openaire/reciter-suggestions/models/openaire-suggestion.model';
import { OpenaireSuggestionTarget } from '../core/openaire/reciter-suggestions/models/openaire-suggestion-target.model';
import { AuthService } from '../core/auth/auth.service';
import { SuggestionApproveAndImport } from '../openaire/reciter-suggestions/suggestion-list-element/suggestion-list-element.component';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { SuggestionTargetsStateService } from '../openaire/reciter-suggestions/suggestion-targets/suggestion-targets.state.service';
import { WorkspaceitemDataService } from '../core/submission/workspaceitem-data.service';
import { PaginationService } from '../core/pagination/pagination.service';
import { FindListOptions } from '../core/data/request.models';

@Component({
  selector: 'ds-suggestion-page',
  templateUrl: './suggestions-page.component.html',
  styleUrls: ['./suggestions-page.component.scss'],
})
export class SuggestionsPageComponent implements OnInit {

  /**
   * The pagination configuration
   */
  paginationOptions: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'sp',
    pageSizeOptions: [5, 10, 20, 40, 60]
  });

  /**
   * The sorting configuration
   */
  paginationSortConfig: SortOptions = new SortOptions('trust', SortDirection.DESC);

  /**
   * The FindListOptions object
   */
  defaultConfig: FindListOptions = Object.assign(new FindListOptions(), {sort: this.paginationSortConfig});

  /**
   * A boolean representing if results are loading
   */
  public processing$ = new BehaviorSubject<boolean>(false);

  /**
   * A list of remote data objects of suggestions
   */
  suggestionsRD$: BehaviorSubject<PaginatedList<OpenaireSuggestion>> = new BehaviorSubject<PaginatedList<OpenaireSuggestion>>({} as any);

  targetRD$: Observable<RemoteData<OpenaireSuggestionTarget>>;
  targetId$: Observable<string>;

  suggestionId: any;
  researcherName: any;
  researcherUuid: any;

  selectedSuggestions: { [id: string]: OpenaireSuggestion } = {};
  isBulkOperationPending = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationsService,
    private paginationService: PaginationService,
    private route: ActivatedRoute,
    private router: Router,
    private suggestionService: SuggestionsService,
    private suggestionTargetsStateService: SuggestionTargetsStateService,
    private translateService: TranslateService,
    private workspaceItemService: WorkspaceitemDataService
  ) {
  }

  ngOnInit(): void {
    this.targetRD$ = this.route.data.pipe(
      map((data: Data) => data.suggestionTargets as RemoteData<OpenaireSuggestionTarget>),
      redirectOn4xx(this.router, this.authService)
    );

    this.targetId$ = this.targetRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((target: OpenaireSuggestionTarget) => target.id)
    );
    this.targetRD$.pipe(
      getFirstSucceededRemoteDataPayload()
    ).subscribe((suggestionTarget: OpenaireSuggestionTarget) => {
      this.suggestionId = suggestionTarget.id;
      this.researcherName = suggestionTarget.display;
      this.researcherUuid = this.suggestionService.getTargetUuid(suggestionTarget);
      this.updatePage();
    });

    this.suggestionTargetsStateService.dispatchMarkUserSuggestionsAsVisitedAction();
  }

  /**
   * Called when one of the pagination settings is changed
   */
  onPaginationChange() {
    this.updatePage();
  }

  /**
   * Update the list of suggestions
   */
  updatePage() {
    this.processing$.next(true);
    const pageConfig$: Observable<FindListOptions> = this.paginationService.getFindListOptions(
      this.paginationOptions.id,
      this.defaultConfig,
      this.paginationOptions
    ).pipe(
      distinctUntilChanged()
    );
    combineLatest([this.targetId$, pageConfig$]).pipe(
      switchMap(([targetId, config]: [string, FindListOptions]) => {
        return this.suggestionService.getSuggestions(
          targetId,
          config.elementsPerPage,
          config.currentPage,
          config.sort
        );
      }),
      take(1)
    ).subscribe((results: PaginatedList<OpenaireSuggestion>) => {
      this.processing$.next(false);
      this.suggestionsRD$.next(results);
      this.suggestionService.clearSuggestionRequests();
    });
  }

  /**
   * Used to delete a suggestion.
   * @suggestionId
   */
  notMine(suggestionId) {
    this.suggestionService.notMine(suggestionId).subscribe((res) => {
      this.suggestionTargetsStateService.dispatchRefreshUserSuggestionsAction();
      this.updatePage();
    });
  }

  /**
   * Used to delete all selected suggestions.
   */
  notMineAllSelected() {
    this.isBulkOperationPending = true;
    this.suggestionService
      .notMineMultiple(Object.values(this.selectedSuggestions))
      .subscribe((results: SuggestionBulkResult) => {
        this.suggestionTargetsStateService.dispatchRefreshUserSuggestionsAction();
        this.updatePage();
        this.isBulkOperationPending = false;
        this.selectedSuggestions = {};
        if (results.success > 0) {
          this.notificationService.success(
            this.translateService.get('reciter.suggestion.notMine.bulk.success',
              {count: results.success}));
        }
        if (results.fails > 0) {
          this.notificationService.error(
            this.translateService.get('reciter.suggestion.notMine.bulk.error',
              {count: results.fails}));
        }
      });
  }

  /**
   * Used to approve & import.
   * @param event contains the suggestion and the target collection
   */
  approveAndImport(event: SuggestionApproveAndImport) {
    this.suggestionService.approveAndImport(this.workspaceItemService, event.suggestion, event.collectionId)
      .subscribe((response: any) => {
        this.suggestionTargetsStateService.dispatchRefreshUserSuggestionsAction();
        this.notificationService.success('reciter.suggestion.approveAndImport.success');
        this.updatePage();
      });
  }

  /**
   * Used to approve & import all selected suggestions.
   * @param event contains the target collection
   */
  approveAndImportAllSelected(event: SuggestionApproveAndImport) {
    this.isBulkOperationPending = true;
    this.suggestionService
      .approveAndImportMultiple(this.workspaceItemService, Object.values(this.selectedSuggestions), event.collectionId)
      .subscribe((results: SuggestionBulkResult) => {
        this.suggestionTargetsStateService.dispatchRefreshUserSuggestionsAction();
        this.updatePage();
        this.isBulkOperationPending = false;
        this.selectedSuggestions = {};
        if (results.success > 0) {
          this.notificationService.success(
            this.translateService.get('reciter.suggestion.approveAndImport.bulk.success',
              {count: results.success}));
        }
        if (results.fails > 0) {
          this.notificationService.error(
            this.translateService.get('reciter.suggestion.approveAndImport.bulk.error',
              {count: results.fails}));
        }
    });
  }

  /**
   * When a specific suggestion is selected.
   * @param object the suggestions
   * @param selected the new selected value for the suggestion
   */
  onSelected(object: OpenaireSuggestion, selected: boolean) {
    if (selected) {
      this.selectedSuggestions[object.id] = object;
    } else {
      delete this.selectedSuggestions[object.id];
    }
  }

  /**
   * When Toggle Select All occurs.
   * @param suggestions all the visible suggestions inside the page
   */
  onToggleSelectAll(suggestions: OpenaireSuggestion[]) {
    if ( this.getSelectedSuggestionsCount() > 0) {
      this.selectedSuggestions = {};
    } else {
      suggestions.forEach((suggestion) => {
        this.selectedSuggestions[suggestion.id] = suggestion;
      });
    }
  }

  /**
   * The current number of selected suggestions.
   */
  getSelectedSuggestionsCount(): number {
    return Object.keys(this.selectedSuggestions).length;
  }

}
