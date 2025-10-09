import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Data,
  Router,
  RouterLink,
} from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
} from 'rxjs';
import {
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';

import { AuthService } from '../core/auth/auth.service';
import {
  SortDirection,
  SortOptions,
} from '../core/cache/models/sort-options.model';
import { FindListOptions } from '../core/data/find-list-options.model';
import { PaginatedList } from '../core/data/paginated-list.model';
import { RemoteData } from '../core/data/remote-data';
import { Suggestion } from '../core/notifications/suggestions/models/suggestion.model';
import { SuggestionTarget } from '../core/notifications/suggestions/models/suggestion-target.model';
import { PaginationService } from '../core/pagination/pagination.service';
import { redirectOn4xx } from '../core/shared/authorized.operators';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '../core/shared/operators';
import { WorkspaceItem } from '../core/submission/models/workspaceitem.model';
import { WorkspaceitemDataService } from '../core/submission/workspaceitem-data.service';
import { SuggestionActionsComponent } from '../notifications/suggestions/actions/suggestion-actions.component';
import { SuggestionApproveAndImport } from '../notifications/suggestions/list-element/suggestion-approve-and-import';
import { SuggestionListElementComponent } from '../notifications/suggestions/list-element/suggestion-list-element.component';
import {
  SuggestionBulkResult,
  SuggestionsService,
} from '../notifications/suggestions/suggestions.service';
import { SuggestionTargetsStateService } from '../notifications/suggestions/targets/suggestion-targets.state.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { ThemedLoadingComponent } from '../shared/loading/themed-loading.component';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { PaginationComponent } from '../shared/pagination/pagination.component';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { VarDirective } from '../shared/utils/var.directive';
import { getWorkspaceItemEditRoute } from '../workflowitems-edit-page/workflowitems-edit-page-routing-paths';

@Component({
  selector: 'ds-suggestion-page',
  templateUrl: './suggestions-page.component.html',
  styleUrls: ['./suggestions-page.component.scss'],
  imports: [
    AlertComponent,
    AsyncPipe,
    PaginationComponent,
    RouterLink,
    SuggestionActionsComponent,
    SuggestionListElementComponent,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
  standalone: true,
})

/**
 * Component used to visualize one of the suggestions from the publication claim page or from the notification pop up
 */

export class SuggestionsPageComponent implements OnInit {

  /**
   * The pagination configuration
   */
  paginationOptions: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'sp',
    pageSizeOptions: [5, 10, 20, 40, 60],
  });

  /**
   * The sorting configuration
   */
  paginationSortConfig: SortOptions = new SortOptions('trust', SortDirection.DESC);

  /**
   * The FindListOptions object
   */
  defaultConfig: FindListOptions = Object.assign(new FindListOptions(), { sort: this.paginationSortConfig });

  /**
   * A boolean representing if results are loading
   */
  public processing$ = new BehaviorSubject<boolean>(false);

  /**
   * A list of remote data objects of suggestions
   */
  suggestionsRD$: BehaviorSubject<PaginatedList<Suggestion>> = new BehaviorSubject<PaginatedList<Suggestion>>({} as any);

  targetRD$: Observable<RemoteData<SuggestionTarget>>;
  targetId$: Observable<string>;

  suggestionTarget: SuggestionTarget;
  suggestionId: any;
  suggestionSource: any;
  researcherName: any;
  researcherUuid: any;

  selectedSuggestions: { [id: string]: Suggestion } = {};
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
    private workspaceItemService: WorkspaceitemDataService,
  ) {
  }

  ngOnInit(): void {
    this.targetRD$ = this.route.data.pipe(
      map((data: Data) => data.suggestionTargets as RemoteData<SuggestionTarget>),
      redirectOn4xx(this.router, this.authService),
    );

    this.targetId$ = this.targetRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((target: SuggestionTarget) => target.id),
    );
    this.targetRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      tap((suggestionTarget: SuggestionTarget) => {
        this.suggestionTarget = suggestionTarget;
        this.suggestionId = suggestionTarget.id;
        this.researcherName = suggestionTarget.display;
        this.suggestionSource = suggestionTarget.source;
        this.researcherUuid = this.suggestionService.getTargetUuid(suggestionTarget);
      }),
      switchMap(() => this.updatePage()),
    ).subscribe();

    this.suggestionTargetsStateService.dispatchMarkUserSuggestionsAsVisitedAction();
  }

  /**
   * Called when one of the pagination settings is changed
   */
  onPaginationChange() {
    this.updatePage().subscribe();
  }

  /**
   * Update the list of suggestions
   */
  updatePage(): Observable<RemoteData<PaginatedList<Suggestion>>> {
    this.processing$.next(true);
    const pageConfig$: Observable<FindListOptions> = this.paginationService.getFindListOptions(
      this.paginationOptions.id,
      this.defaultConfig,
    ).pipe(
      distinctUntilChanged(),
    );

    return combineLatest([this.targetId$, pageConfig$]).pipe(
      switchMap(([targetId, config]: [string, FindListOptions]) => {
        return this.suggestionService.getSuggestions(
          targetId,
          config.elementsPerPage,
          config.currentPage,
          config.sort,
        );
      }),
      getFirstCompletedRemoteData(),
      tap((resultsRD: RemoteData<PaginatedList<Suggestion>>) => {
        this.processing$.next(false);
        if (resultsRD.hasSucceeded) {
          this.suggestionsRD$.next(resultsRD.payload);
        } else {
          this.suggestionsRD$.next(null);
        }

        this.suggestionService.clearSuggestionRequests();
      }),
    );
  }

  /**
   * Used to delete a suggestion.
   * @suggestionId
   */
  ignoreSuggestion(suggestionId) {
    this.suggestionService.ignoreSuggestion(suggestionId).pipe(
      tap(() => this.suggestionTargetsStateService.dispatchRefreshUserSuggestionsAction()),
      switchMap(() => this.updatePage()),
    ).subscribe();
  }

  /**
   * Used to delete all selected suggestions.
   */
  ignoreSuggestionAllSelected() {
    this.isBulkOperationPending = true;
    this.suggestionService.ignoreSuggestionMultiple(Object.values(this.selectedSuggestions)).pipe(
      tap((results: SuggestionBulkResult) => {
        this.suggestionTargetsStateService.dispatchRefreshUserSuggestionsAction();
        this.isBulkOperationPending = false;
        this.selectedSuggestions = {};
        if (results.success > 0) {
          this.notificationService.success(
            this.translateService.get('suggestion.ignoreSuggestion.bulk.success',
              { count: results.success }));
        }
        if (results.fails > 0) {
          this.notificationService.error(
            this.translateService.get('suggestion.ignoreSuggestion.bulk.error',
              { count: results.fails }));
        }
      }),
      switchMap(() => this.updatePage()),
    ).subscribe();
  }

  /**
   * Used to approve & import.
   * @param event contains the suggestion and the target collection
   */
  approveAndImport(event: SuggestionApproveAndImport) {
    this.suggestionService.approveAndImport(this.workspaceItemService, event.suggestion, event.collectionId).pipe(
      tap((workspaceitem: WorkspaceItem) => {
        const content = this.translateService.instant('suggestion.approveAndImport.success', { url: getWorkspaceItemEditRoute(workspaceitem.id) });
        this.notificationService.success('', content, { timeOut:0 }, true);
        this.suggestionTargetsStateService.dispatchRefreshUserSuggestionsAction();
      }),
      switchMap(() => this.updatePage()),
    ).subscribe();
  }

  /**
   * Used to approve & import all selected suggestions.
   * @param event contains the target collection
   */
  approveAndImportAllSelected(event: SuggestionApproveAndImport) {
    this.isBulkOperationPending = true;
    this.suggestionService.approveAndImportMultiple(this.workspaceItemService, Object.values(this.selectedSuggestions), event.collectionId).pipe(
      tap((results: SuggestionBulkResult) => {
        this.suggestionTargetsStateService.dispatchRefreshUserSuggestionsAction();
        this.isBulkOperationPending = false;
        this.selectedSuggestions = {};
        if (results.success > 0) {
          this.notificationService.success(
            this.translateService.get('suggestion.approveAndImport.bulk.success',
              { count: results.success }));
        }
        if (results.fails > 0) {
          this.notificationService.error(
            this.translateService.get('suggestion.approveAndImport.bulk.error',
              { count: results.fails }));
        }
      }),
      switchMap(() => this.updatePage()),
    ).subscribe();
  }

  /**
   * When a specific suggestion is selected.
   * @param object the suggestions
   * @param selected the new selected value for the suggestion
   */
  onSelected(object: Suggestion, selected: boolean) {
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
  onToggleSelectAll(suggestions: Suggestion[]) {
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

  /**
   * Return true if all the suggestion are configured with the same fixed collection in the configuration.
   * @param suggestions
   */
  isCollectionFixed(suggestions: Suggestion[]): boolean {
    return this.suggestionService.isCollectionFixed(suggestions);
  }

  /**
   * Label to be used to translate the suggestion source.
   */
  translateSuggestionSource() {
    return this.suggestionService.translateSuggestionSource(this.suggestionSource);
  }

  /**
   * Label to be used to translate the suggestion type.
   */
  translateSuggestionType() {
    return this.suggestionService.translateSuggestionType(this.suggestionSource);
  }

}
