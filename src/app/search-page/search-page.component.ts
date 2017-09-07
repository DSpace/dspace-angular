import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from '../search/search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RemoteData } from '../core/data/remote-data';
import { SearchResult } from '../search/search-result.model';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { SortOptions } from '../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { SearchOptions } from '../search/search-options.model';
import { CommunityDataService } from '../core/data/community-data.service';
import { hasValue } from '../shared/empty.util';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-page',
  styleUrls: ['./search-page.component.scss'],
  templateUrl: './search-page.component.html',
})
export class SearchPageComponent implements OnInit, OnDestroy {
  private sub;
  private currentParams = {};
  private pagination = new PaginationComponentOptions();
  query: string;
  scopeObject: RemoteData<DSpaceObject>;
  results: RemoteData<Array<SearchResult<DSpaceObject>>>;
  searchOptions: SearchOptions;

  constructor(private service: SearchService,
              private route: ActivatedRoute,
              private communityService: CommunityDataService,) {
    this.pagination.id = 'search-results-pagination';
  }

  ngOnInit(): void {
    this.sub = this.route
      .queryParams
      .subscribe((params) => {
          // Save current parameters
          this.currentParams = params;
          // Update scope object
          this.scopeObject = hasValue(params.scope) ? this.communityService.findById(params.scope) : undefined;
          // Prepare search parameters
          this.query = params.query || '';
          this.pagination.currentPage = +params.page || 1;
          this.pagination.pageSize = +params.pageSize || 10;
          const sort: SortOptions = new SortOptions(params.sortField, params.sortDirection);
          // Create search options
          this.searchOptions = { pagination: this.pagination, sort: sort };
          // Resolve search results
          this.results = this.service.search(this.query, params.scope, this.searchOptions);
        }
      );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
