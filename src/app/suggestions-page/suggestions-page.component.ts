import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { flatMap, map, take } from 'rxjs/operators';

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

  evidences: any;
  isShowEvidence = false;

  suggestionId: any;
  researcherName: any;

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
    this.suggestionService.deleteReviewedSuggestion(suggestionId)
      .subscribe((res) => {
        this.updatePage();
      });
  }

  /**
   * Used to to see evidence
   * @evidences
   */
  seeEvidence(evidences) {
    this.evidences = evidences;
    this.isShowEvidence = true;
  }

  /**
   * Used to show suggestion list
   * @param event
   */
  back(event) {
    this.evidences = {};
    this.isShowEvidence = false;
  }

  /**
   * Used to approve & import
   * @param event
   */
  approveAndImport(event) {
    this.itemService.importExternalSourceEntry(event.suggestion.externalSourceUri, event.collectionId).pipe().subscribe((response: any) => {
      this.updatePage();
    });
  }
}
