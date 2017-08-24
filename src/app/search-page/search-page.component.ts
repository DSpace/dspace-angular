import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from '../search/search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RemoteData } from '../core/data/remote-data';
import { SearchResult } from '../search/search-result.model';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { SortOptions } from '../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';

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
  private query: string;
  private scope: string;
  private page: number;
  private results: RemoteData<Array<SearchResult<DSpaceObject>>>;
  private currentParams = {};

  constructor(private service: SearchService,
              private route: ActivatedRoute,
              private router: Router,) {
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
          pagination.id = 'results-pagination';
          pagination.currentPage = this.page;
          pagination.pageSize = +params.pageSize;
          this.results = this.service.search(this.query, this.scope, {
            pagination: pagination,
            sort: new SortOptions(params.sortField, params.sortDirection)
          });
        }
      );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  updateSearch(data: any) {
    this.router.navigate([], {
      queryParams: Object.assign({}, this.currentParams,
        {
          query: data.query,
          scope: data.scope,
          page: data.page || 1
        }
      )
    })
    ;
  }
}
