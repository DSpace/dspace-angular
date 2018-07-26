import { Component, Input } from '@angular/core';
import { RemoteData } from '../../core/data/remote-data';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { fadeIn, fadeInOut } from '../../shared/animations/fade';
import { SearchOptions, ViewMode } from '../search-options.model';
import { SortOptions } from '../../core/cache/models/sort-options.model';
import { SearchResult } from '../search-result.model';
import { PaginatedList } from '../../core/data/paginated-list';

@Component({
  selector: 'ds-search-results',
  templateUrl: './search-results.component.html',
  animations: [
    fadeIn,
    fadeInOut
  ]
})

/**
 * Component that represents all results from a search
 */
export class SearchResultsComponent {
  /**
   * The actual search result objects
   */
  @Input() searchResults: RemoteData<PaginatedList<SearchResult<DSpaceObject>>>;

  /**
   * The current configuration of the search
   */
  @Input() searchConfig: SearchOptions;

  /**
   * The current sort options for the search
   */
  @Input() sortConfig: SortOptions;

  /**
   * The current view mode for the search results
   */
  @Input() viewMode: ViewMode;
}
