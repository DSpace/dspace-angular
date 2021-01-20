import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { flatMap, map, take } from 'rxjs/operators';

import { SortDirection, SortOptions, } from '../core/cache/models/sort-options.model';
import { PaginatedList } from '../core/data/paginated-list';
import { RemoteData } from '../core/data/remote-data';
import { getFirstSucceededRemoteDataPayload, redirectOn4xx } from '../core/shared/operators';
import {SuggestionBulkResult, SuggestionsService} from '../openaire/reciter-suggestions/suggestions.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { ItemDataService } from '../core/data/item-data.service';
import { OpenaireSuggestion } from '../core/openaire/reciter-suggestions/models/openaire-suggestion.model';
import { OpenaireSuggestionTarget } from '../core/openaire/reciter-suggestions/models/openaire-suggestion-target.model';
import { AuthService } from '../core/auth/auth.service';
import { SuggestionApproveAndImport } from '../openaire/reciter-suggestions/suggestion-list-element/suggestion-list-element.component';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-suggestion-page',
  templateUrl: './suggestions-page.component.html',
  styleUrls: ['./suggestions-page.component.scss'],
})
export class SuggestionsPageComponent implements OnInit {

  paginationConfig: PaginationComponentOptions;
  /**
   * The pagination configuration
   */
  config: PaginationComponentOptions;

  /**
   * The pagination id
   */
  pageId = 'suggestions-pagination';

  /**
   * The sorting configuration
   */
  sortConfig: SortOptions;

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
    private route: ActivatedRoute,
    private router: Router,
    private suggestionService: SuggestionsService,
    private itemService: ItemDataService,
    private notificationService: NotificationsService,
    private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.config = new PaginationComponentOptions();
    this.config.id = this.pageId;
    this.config.pageSize = 10;
    this.config.currentPage = 1;
    this.sortConfig = new SortOptions('dc.title', SortDirection.ASC);

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
  }

  /**
   * Called when one of the pagination settings is changed
   * @param event The new pagination data
   */
  onPaginationChange(event) {
    this.config.currentPage = event;
    this.updatePage();
  }

  /**
   * Update the list of suggestions
   */
  updatePage() {
    this.targetId$.pipe(
      flatMap((targetId: string) => this.suggestionService.getSuggestions(
        targetId,
        this.config.pageSize,
        this.config.currentPage,
      )),
      take(1)
    ).subscribe((results: PaginatedList<OpenaireSuggestion>) => {
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
      })
  }

  /**
   * Used to approve & import.
   * @param event contains the suggestion and the target collection
   */
  approveAndImport(event: SuggestionApproveAndImport) {
    debugger;
    this.suggestionService.approveAndImport(this.itemService, event.suggestion, event.collectionId)
      .subscribe((response: any) => {
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
      .approveAndImportMultiple(this.itemService, Object.values(this.selectedSuggestions), event.collectionId)
      .subscribe((results: SuggestionBulkResult) => {
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
    })
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
      })
    }
  }

  /**
   * The current number of selected suggestions.
   */
  getSelectedSuggestionsCount(): number {
    return Object.keys(this.selectedSuggestions).length
  }

}
