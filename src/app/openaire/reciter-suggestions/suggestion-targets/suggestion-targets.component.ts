import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { OpenaireSuggestionTarget } from '../../../core/openaire/reciter-suggestions/models/openaire-suggestion-target.model';
import { hasValue } from '../../../shared/empty.util';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { SuggestionTargetsStateService } from './suggestion-targets.state.service';
import { getSuggestionPageRoute } from '../../../suggestions-page/suggestions-page-routing-paths';
import { AdminNotificationsSuggestionTargetsPageParams } from '../../../+admin/admin-notifications/admin-notifications-suggestion-targets-page/admin-notifications-suggestion-targets-page-resolver.service';
import { SuggestionsService } from '../suggestions.service';

/**
 * Component to display the Suggestion Target list.
 */
@Component({
  selector: 'ds-suggestion-target',
  templateUrl: './suggestion-targets.component.html',
  styleUrls: ['./suggestion-targets.component.scss'],
})
export class SuggestionTargetsComponent implements OnInit {

  /**
   * The source for which to list targets
   */
  @Input() source: string;

  /**
   * The number of Suggestion Targets per page.
   */
  public elementsPerPage = 10;
  /**
   * The pagination system configuration for HTML listing.
   * @type {PaginationComponentOptions}
   */
  public paginationConfig: PaginationComponentOptions;
  /**
   * The Suggestion Target list.
   */
  public targets$: Observable<OpenaireSuggestionTarget[]>;
  /**
   * The total number of Suggestion Targets.
   */
  public totalElements$: Observable<number>;
  /**
   * Array to track all the component subscriptions. Useful to unsubscribe them with 'onDestroy'.
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  /**
   * Initialize the component variables.
   * @param {ActivatedRoute} activatedRoute
   * @param {SuggestionTargetsStateService} suggestionTargetsStateService
   * @param {Router} router
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private suggestionTargetsStateService: SuggestionTargetsStateService,
    private suggestionService: SuggestionsService,
    private router: Router
  ) {
  }

  /**
   * Component initialization.
   */
  ngOnInit(): void {
    this.paginationConfig = new PaginationComponentOptions();
    this.paginationConfig.id = 'reciter_suggestion_target';
    this.paginationConfig.pageSize = this.elementsPerPage;
    this.paginationConfig.currentPage = 1;
    this.paginationConfig.pageSizeOptions = [ 5, 10, 20, 30, 50 ];
    this.subs.push(
      this.activatedRoute.data.pipe(
        map((data) => data.reciterSuggestionTargetParams),
        take(1)
      ).subscribe((suggestionTargetsParams) => {
        this.updatePaginationFromRouteParams(suggestionTargetsParams);
        this.targets$ = this.suggestionTargetsStateService.getReciterSuggestionTargets();
        this.totalElements$ = this.suggestionTargetsStateService.getReciterSuggestionTargetsTotals();
      })
    );
  }

  /**
   * First Suggestion Targets loading after view initialization.
   */
  ngAfterViewInit(): void {
    this.subs.push(
      this.suggestionTargetsStateService.isReciterSuggestionTargetsLoaded().pipe(
        take(1)
      ).subscribe(() => {
        this.getSuggestionTargets();
      })
    );
  }

  /**
   * Returns the information about the loading status of the Suggestion Targets (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if the targets are loading, 'false' otherwise.
   */
  public isTargetsLoading(): Observable<boolean> {
    return this.suggestionTargetsStateService.isReciterSuggestionTargetsLoading();
  }

  /**
   * Returns the information about the processing status of the Suggestion Targets (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if there are operations running on the targets (ex.: a REST call), 'false' otherwise.
   */
  public isTargetsProcessing(): Observable<boolean> {
    return this.suggestionTargetsStateService.isReciterSuggestionTargetsProcessing();
  }

  /**
   * Set the current page for the pagination system.
   *
   * @param {number} page
   *    the number of the current page
   */
  public setPage(page: number) {
    if (this.paginationConfig.currentPage !== page) {
      this.paginationConfig.currentPage = page;
      this.getSuggestionTargets();
    }
  }

  /**
   * Set the current page size for the pagination system.
   *
   * @param {number} pageSize
   *    the number of the current page size
   */
  public setPageSize(pageSize: number) {
    if (this.paginationConfig.pageSize !== pageSize) {
      this.paginationConfig.pageSize = pageSize;
      this.getSuggestionTargets();
    }
  }

  /**
   * Redirect to suggestion page.
   *
   * @param {string} id
   *    the id of suggestion target
   * @param {string} name
   *    the name of suggestion target
   */
  public redirectToSuggestions(id: string, name: string) {
    this.router.navigate([getSuggestionPageRoute(id)]);
  }

  /**
   * Unsubscribe from all subscriptions.
   */
  ngOnDestroy(): void {
    this.suggestionTargetsStateService.dispatchClearSuggestionTargetsAction();
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

  /**
   * Dispatch the Suggestion Targets retrival.
   */
  protected getSuggestionTargets(): void {
    this.suggestionTargetsStateService.dispatchRetrieveReciterSuggestionTargets(
      this.source,
      this.paginationConfig.pageSize,
      this.paginationConfig.currentPage
    );
  }

  /**
   * Update pagination Config from route params
   *
   * @param suggestionTargetsRouteParams
   */
  protected updatePaginationFromRouteParams(suggestionTargetsRouteParams: AdminNotificationsSuggestionTargetsPageParams) {
    if (suggestionTargetsRouteParams.currentPage) {
      this.paginationConfig.currentPage = suggestionTargetsRouteParams.currentPage;
    }
    if (suggestionTargetsRouteParams.pageSize) {
      if (this.paginationConfig.pageSizeOptions.includes(suggestionTargetsRouteParams.pageSize)) {
        this.paginationConfig.pageSize = suggestionTargetsRouteParams.pageSize;
      } else {
        this.paginationConfig.pageSize = this.paginationConfig.pageSizeOptions[0];
      }
    }
  }

  public getTargetUuid(target: OpenaireSuggestionTarget) {
    return this.suggestionService.getTargetUuid(target);
  }
}
