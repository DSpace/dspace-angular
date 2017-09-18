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
import { isNotEmpty } from '../shared/empty.util';
import { Community } from '../core/shared/community.model';

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
  query: string;
  private scope: string;
  scopeObject: RemoteData<DSpaceObject>;
  private page: number;
  results: RemoteData<Array<SearchResult<DSpaceObject>>>;
  currentParams = {};
  searchOptions: SearchOptions;
  scopeList: RemoteData<Community[]>;

  constructor(private service: SearchService,
              private route: ActivatedRoute,
              private communityService: CommunityDataService,) {
    this.scopeList = communityService.findAll();
  }

  ngOnInit(): void {
    this.sub = this.route
      .queryParams
      .subscribe((params) => {
          this.currentParams = params;
          this.query = params.query || '';
          this.scope = params.scope;
          this.page = +params.page || 1;
          const pagination: PaginationComponentOptions = new PaginationComponentOptions();
          pagination.id = 'search-results-pagination';
          pagination.currentPage = this.page;
          pagination.pageSize = +params.pageSize || 10;
          const sort: SortOptions = new SortOptions(params.sortField, params.sortDirection);
          this.searchOptions = { pagination: pagination, sort: sort };
          this.results = this.service.search(this.query, this.scope, this.searchOptions);
          if (isNotEmpty(this.scope)) {
            this.scopeObject = this.communityService.findById(this.scope);
          } else {
            this.scopeObject = undefined;
          }
        }
      );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
