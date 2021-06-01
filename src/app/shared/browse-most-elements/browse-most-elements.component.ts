import { Component, Input, OnInit } from '@angular/core';
import { SearchService } from '../../core/shared/search/search.service';
import { PaginatedSearchOptions } from '../search/paginated-search-options.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { SearchResult } from '../search/search-result.model';
import { Context } from '../../core/shared/context.model';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';

@Component({
  selector: 'ds-browse-most-elements',
  styleUrls: ['./browse-most-elements.component.scss'],
  templateUrl: './browse-most-elements.component.html',
})

export class BrowseMostElementsComponent implements OnInit {

  @Input() paginatedSearchOptions: PaginatedSearchOptions;

  @Input() context: Context;

  searchResults: RemoteData<PaginatedList<SearchResult<DSpaceObject>>>;

  constructor(private searchService: SearchService) { /* */ }

  ngOnInit() {

    this.searchService.search(this.paginatedSearchOptions)
      .subscribe((response: RemoteData<PaginatedList<SearchResult<DSpaceObject>>>) => {
          this.searchResults = response as any;
      });
  }

}
