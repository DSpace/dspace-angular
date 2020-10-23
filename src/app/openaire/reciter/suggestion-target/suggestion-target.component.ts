import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { SortOptions } from '../../../core/cache/models/sort-options.model';
import { SuggestionTargetObject } from '../../../core/openaire/reciter-suggestions/models/suggestion-target.model';
import { hasValue } from '../../../shared/empty.util';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { ReciterSuggestionStateService } from '../recitersuggestions.state.service';
import { getSuggestionPageRoute } from '../../../suggestion-page/suggestion-page-routing-paths';

/**
 * Component to display the Suggestion Target list.
 */
@Component({
  selector: 'ds-suggestion-target',
  templateUrl: './suggestion-target.component.html',
  styleUrls: ['./suggestion-target.component.scss'],
})
export class SuggestionTargetComponent implements OnInit {
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
   * The Suggestion Target list sort options.
   * @type {SortOptions}
   */
  public paginationSortConfig: SortOptions;
  /**
   * The Suggestion Target list.
   */
  public targets$: Observable<SuggestionTargetObject[]>;
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
   * @param {ReciterSuggestionStateService} reciterSuggestionStateService
   * @param {Router} router
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private reciterSuggestionStateService: ReciterSuggestionStateService,
    private router: Router
  ) {
  }

  /**
   * Component intitialization.
   */
  ngOnInit(): void {
    this.paginationConfig = new PaginationComponentOptions();
    this.paginationConfig.id = 'reciter_suggestion_target';
    this.paginationConfig.pageSize = this.elementsPerPage;
    this.paginationConfig.currentPage = 0;
    this.paginationConfig.pageSizeOptions = [20, 30, 50];
    this.subs.push(
      this.activatedRoute.data.pipe(
        map((data) => {
          if (data.reciterSuggestionTargetParams.currentPage) {
            this.paginationConfig.currentPage = data.reciterSuggestionTargetParams.currentPage;
          }
          if (data.reciterSuggestionTargetParams.pageSize) {
            if (this.paginationConfig.pageSizeOptions.includes(data.reciterSuggestionTargetParams.pageSize)) {
              this.paginationConfig.pageSize = data.reciterSuggestionTargetParams.currentPage;
            } else {
              this.paginationConfig.pageSize = this.paginationConfig.pageSizeOptions[0];
            }
          }
          this.targets$ = this.reciterSuggestionStateService.getReciterSuggestionTargets();
          this.totalElements$ = this.reciterSuggestionStateService.getReciterSuggestionTargetsTotals();
        })
      )
        .subscribe()
    );
  }

  /**
   * First Suggestion Targets loading after view initialization.
   */
  ngAfterViewInit(): void {
    this.subs.push(
      this.reciterSuggestionStateService.isReciterSuggestionTargetsLoaded().pipe(
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
    return this.reciterSuggestionStateService.isReciterSuggestionTargetsLoading();
  }

  /**
   * Returns the information about the processing status of the Suggestion Targets (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if there are operations running on the targets (ex.: a REST call), 'false' otherwise.
   */
  public isTargetsProcessing(): Observable<boolean> {
    return this.reciterSuggestionStateService.isReciterSuggestionTargetsProcessing();
  }

  /**
   * Set the current page for the pagination system.
   *
   * @param {number} page
   *    the number of the current page
   */
  public setPage(page: number) {
    this.paginationConfig.currentPage = page;
    this.getSuggestionTargets();
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
    this.router.navigate([getSuggestionPageRoute(id, name)]);
  }

  /**
   * Unsubscribe from all subscriptions.
   */
  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

  /**
   * Dispatch the Suggestion Targets retrival.
   */
  protected getSuggestionTargets(): void {
    this.reciterSuggestionStateService.dispatchRetrieveReciterSuggestionTargets(
      this.elementsPerPage,
      this.paginationConfig.currentPage
    );
  }
}
