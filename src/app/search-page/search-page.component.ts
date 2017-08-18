import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search/search.service';
import { ActivatedRoute } from '@angular/router';
import { SortOptions } from '../core/cache/models/sort-options.model';
import { RemoteData } from '../core/data/remote-data';
import { SearchResult } from '../search/search-result.model';
import { DSpaceObject } from '../core/shared/dspace-object.model';

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
export class SearchPageComponent implements OnInit {
    private sub;
    private results: RemoteData<Array<SearchResult<DSpaceObject>>>;

    constructor(
      private service: SearchService,
      private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.sub = this.route
          .queryParams
          .subscribe((params) => {
              const query: string = params.query || '';
              const scope: string = params.scope;
              const page: number = +params.page || 0;
              this.results = this.service.search(query, scope, {elementsPerPage: 10, currentPage: page, sort: new SortOptions()});
          });
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
