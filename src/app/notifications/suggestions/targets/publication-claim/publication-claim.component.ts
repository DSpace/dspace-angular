import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  Router,
  RouterLink,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  Subscription,
} from 'rxjs';
import {
  distinctUntilChanged,
  take,
} from 'rxjs/operators';

import { SuggestionTarget } from '../../../../core/notifications/suggestions/models/suggestion-target.model';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { hasValue } from '../../../../shared/empty.util';
import { ThemedLoadingComponent } from '../../../../shared/loading/themed-loading.component';
import { PaginationComponent } from '../../../../shared/pagination/pagination.component';
import { PaginationComponentOptions } from '../../../../shared/pagination/pagination-component-options.model';
import { getSuggestionPageRoute } from '../../../../suggestions-page/suggestions-page-routing-paths';
import { SuggestionsService } from '../../suggestions.service';
import { SuggestionTargetsStateService } from '../suggestion-targets.state.service';

/**
 * Component to display the Suggestion Target list.
 */
@Component({
  selector: 'ds-publication-claim',
  templateUrl: './publication-claim.component.html',
  styleUrls: ['./publication-claim.component.scss'],
  imports: [
    AsyncPipe,
    PaginationComponent,
    RouterLink,
    ThemedLoadingComponent,
    TranslateModule,
  ],
  standalone: true,
})
export class PublicationClaimComponent implements AfterViewInit, OnDestroy, OnInit {

  /**
   * The source for which to list targets
   */
  sourceId = input<string>();

  /**
   * The pagination system configuration for HTML listing.
   * @type {PaginationComponentOptions}
   */
  public paginationConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'stp_' + this.sourceId,
    pageSizeOptions: [5, 10, 20, 40, 60],
  });

  /**
   * The Suggestion Target list.
   */
  public targets$: Observable<SuggestionTarget[]>;
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
   * @param {PaginationService} paginationService
   * @param {SuggestionTargetsStateService} suggestionTargetsStateService
   * @param {SuggestionsService} suggestionService
   * @param {Router} router
   */
  constructor(
    private paginationService: PaginationService,
    private suggestionTargetsStateService: SuggestionTargetsStateService,
    private suggestionService: SuggestionsService,
    private router: Router,
  ) {
  }

  /**
   * Component initialization.
   */
  ngOnInit(): void {
    this.targets$ = this.suggestionTargetsStateService.getSuggestionTargets(this.sourceId());
    this.totalElements$ = this.suggestionTargetsStateService.getSuggestionTargetsTotals(this.sourceId());
  }

  /**
   * First Suggestion Targets loading after view initialization.
   */
  ngAfterViewInit(): void {
    this.subs.push(
      this.suggestionTargetsStateService.isSuggestionTargetsLoaded(this.sourceId()).pipe(
        take(1),
      ).subscribe(() => {
        this.getSuggestionTargets();
      }),
    );
  }

  /**
   * Returns the information about the loading status of the Suggestion Targets (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if the targets are loading, 'false' otherwise.
   */
  public isTargetsLoading(): Observable<boolean> {
    return this.suggestionTargetsStateService.isSuggestionTargetsLoading(this.sourceId());
  }

  /**
   * Returns the information about the processing status of the Suggestion Targets (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if there are operations running on the targets (ex.: a REST call), 'false' otherwise.
   */
  public isTargetsProcessing(): Observable<boolean> {
    return this.suggestionTargetsStateService.isSuggestionTargetsProcessing(this.sourceId());
  }

  /**
   * Redirect to suggestion page.
   *
   * @param {string} id
   *    the id of suggestion target
   */
  public redirectToSuggestions(id: string) {
    this.router.navigate([getSuggestionPageRoute(id)]);
  }

  /**
   * Unsubscribe from all subscriptions.
   */
  ngOnDestroy(): void {
    this.suggestionTargetsStateService.dispatchClearSuggestionTargetsAction(this.sourceId());
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

  /**
   * Dispatch the Suggestion Targets retrieval.
   */
  public getSuggestionTargets(): void {
    this.paginationService.getCurrentPagination(this.paginationConfig.id, this.paginationConfig).pipe(
      distinctUntilChanged(),
      take(1),
    ).subscribe((options: PaginationComponentOptions) => {
      this.suggestionTargetsStateService.dispatchRetrieveSuggestionTargets(
        this.sourceId(),
        options.pageSize,
        options.currentPage,
      );
    });
  }

  public getTargetUuid(target: SuggestionTarget) {
    return this.suggestionService.getTargetUuid(target);
  }
}
