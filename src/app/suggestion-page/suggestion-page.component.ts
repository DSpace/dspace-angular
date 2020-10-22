import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { SortDirection, SortOptions, } from '../core/cache/models/sort-options.model';
import { CollectionDataService } from '../core/data/collection-data.service';
import { PaginatedList } from '../core/data/paginated-list';
import { RemoteData } from '../core/data/remote-data';
import { Collection } from '../core/shared/collection.model';
import { redirectToPageNotFoundOn404 } from '../core/shared/operators';
import { SuggestionTargetsService } from '../openaire/reciter/suggestion-target/suggestion-target.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { ItemDataService } from '../core/data/item-data.service';

@Component({
  selector: 'ds-suggestion-page',
  templateUrl: './suggestion-page.component.html',
  styleUrls: ['./suggestion-page.component.scss'],
})
export class SuggestionPageComponent implements OnInit {
  collectionRD$: Observable<RemoteData<Collection>>;

  paginationConfig: PaginationComponentOptions;
  /**
   * The pagination configuration
   */
  config: PaginationComponentOptions;

  /**
   * The pagination id
   */
  pageId = 'community-collections-pagination';

  /**
   * The sorting configuration
   */
  sortConfig: SortOptions;

  /**
   * A list of remote data objects of communities' collections
   */
  subCollectionsRDObs: BehaviorSubject<
    PaginatedList<any>
  > = new BehaviorSubject<PaginatedList<any>>({} as any);

  evidences: any;
  isShowEvidence = false;

  suggestionId: any;
  researcherName: any;

  constructor(
    private cds: CollectionDataService,
    private route: ActivatedRoute,
    private router: Router,
    private suggestionTargetsService: SuggestionTargetsService,
    private itemService: ItemDataService
  ) {}

  ngOnInit(): void {
    this.collectionRD$ = this.route.data.pipe(
      map((data) => data as RemoteData<Collection>),
      redirectToPageNotFoundOn404(this.router),
      take(1)
    );

    this.config = new PaginationComponentOptions();
    this.config.id = this.pageId;
    this.config.pageSize = 1;
    this.config.currentPage = 1;
    this.sortConfig = new SortOptions('dc.title', SortDirection.ASC);

    this.route.params.subscribe((params: Params) => {
      this.suggestionId = params.id;
      this.researcherName = params.name;
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
   * Update the list of collections
   */
  updatePage() {
    this.suggestionTargetsService
      .getReviewSuggestions(
        this.config.pageSize,
        this.config.currentPage,
        this.suggestionId
      )
      .subscribe((results) => {
        this.subCollectionsRDObs.next(results);
      });
  }

  /**
   * Used to delete suggestion
   * @suggestionId
   */
  notMine(suggestionId) {
    this.suggestionTargetsService
      .deleteReviewSuggestions(suggestionId)
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
    this.itemService.importExternalSourceEntry(event.suggestion, event.collectionId).pipe().subscribe((response: any) => {
      this.updatePage();
    });
  }
}
