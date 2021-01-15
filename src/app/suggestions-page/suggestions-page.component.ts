import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';

import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { concatAll, flatMap, map, switchMap, take } from 'rxjs/operators';

import { SortDirection, SortOptions, } from '../core/cache/models/sort-options.model';
import { PaginatedList } from '../core/data/paginated-list';
import { RemoteData } from '../core/data/remote-data';
import { getFirstSucceededRemoteDataPayload, redirectOn4xx } from '../core/shared/operators';
import { SuggestionsService } from '../openaire/reciter-suggestions/suggestions.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { ItemDataService } from '../core/data/item-data.service';
import { OpenaireSuggestion } from '../core/openaire/reciter-suggestions/models/openaire-suggestion.model';
import { OpenaireSuggestionTarget } from '../core/openaire/reciter-suggestions/models/openaire-suggestion-target.model';
import { AuthService } from '../core/auth/auth.service';
import { SuggestionApproveAndImport } from '../openaire/reciter-suggestions/suggestion-list-element/suggestion-list-element.component';

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

  selectedSuggestions: { [id: string]: OpenaireSuggestion } = {};
  isBulkOperationPending = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private suggestionService: SuggestionsService,
    private itemService: ItemDataService
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
   * Used to delete suggestion
   * @suggestionId
   */
  notMine(suggestionId) {
    this.notMineImpl(suggestionId).subscribe((res) => {
      this.updatePage();
    });
  }

  /**
   * Used to bulk delete suggestion
   * @suggestionId
   */
  notMineAllSelected() {
    this.isBulkOperationPending = true;
    forkJoin(Object.values(this.selectedSuggestions)
      .map((suggestion: OpenaireSuggestion) => this.notMineImpl(suggestion.id)))
      .pipe(concatAll(), take(1))
      .subscribe((res) => {
        console.log('All selections processed');
        this.updatePage();
        this.isBulkOperationPending = false;
      });
  }

  /**
   * Used to approve & import
   * @param event
   */
  approveAndImport(event: SuggestionApproveAndImport) {
    this.approveAndImportImpl(event.suggestion, event.collectionId).subscribe((response: any) => {
      console.log('All selections processed');
      this.updatePage();
    });
  }

  /**
   * Used to bulk approve & import
   */
  approveAndImportAllSelected(event: SuggestionApproveAndImport) {
    this.isBulkOperationPending = true;
    forkJoin(Object.values(this.selectedSuggestions)
      .map((suggestion: OpenaireSuggestion) => this.approveAndImportImpl(suggestion, event.collectionId)))
      .pipe(concatAll(), take(1))
      .subscribe((result) => {
        this.updatePage();
        this.isBulkOperationPending = false;
    })
  }

  /**
   * When a specific suggestion is selected.
   * @param object
   * @param selected
   */
  onSelected(object: OpenaireSuggestion, selected: boolean) {
    if (selected) {
      this.selectedSuggestions[object.id] = object;
    } else {
      delete this.selectedSuggestions[object.id];
    }
  }

  /**
   * When the toggle select all occurs.
   * @param suggestions
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

  /**
   * Perform the approve and import operation.
   * @param suggestion
   * @param collectionId
   * @private
   */
  private approveAndImportImpl(suggestion, collectionId): Observable<any> {
    return this.itemService.importExternalSourceEntry(suggestion.externalSourceUri, collectionId)
      .pipe(
        getFirstSucceededRemoteDataPayload(),
        switchMap((res) => {
          return this.suggestionService.deleteReviewedSuggestion(suggestion.id).pipe(
            // catchError((error) => {
            //   console.error('The approve and import request for id ' + suggestion.id + ' has failed');
            //   console.log('The operation is skipped');
            //   return of(null);
            // })
          );
        }),
        // catchError((error) => {
        //   console.error('The approve and import request for id ' + suggestion.id + ' has failed');
        //   console.log('The operation is skipped');
        //   return of(null);
        // })
      );
    ;
  }

  /**
   * Perform the delete operation.
   * @param suggestionId
   * @private
   */
  private notMineImpl(suggestionId): Observable<any> {
    return this.suggestionService.deleteReviewedSuggestion(suggestionId).pipe(
      // catchError((error) => {
      //   console.error('The delete request for id ' + suggestionId + ' has failed');
      //   console.log('The operation is skipped');
      //   return of(null);
      // })
    )
  }
}
