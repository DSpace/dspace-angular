import { Component, Input } from '@angular/core';
import { RemoteData } from '../../core/data/remote-data';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { fadeIn, fadeInOut } from '../../shared/animations/fade';
import { SetViewMode } from '../../shared/view-mode';
import { SearchOptions } from '../search-options.model';
import { SortOptions } from '../../core/cache/models/sort-options.model';
import { SearchResult } from '../search-result.model';
import { PaginatedList } from '../../core/data/paginated-list';
import { hasValue, isNotEmpty } from '../../shared/empty.util';

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
  @Input() sortConfig: SortOptions;
  @Input() viewMode: SetViewMode;
  @Input() fixedFilter: string;
  @Input() disableHeader = false;

  /**
   * Get the i18n key for the title depending on the fixed filter
   * Defaults to 'search.results.head' if there's no fixed filter found
   * @returns {string}
   */
  getTitleKey() {
    if (isNotEmpty(this.fixedFilter)) {
      return 'search.' + this.fixedFilter + '.results.head'
    } else {
      return 'search.results.head';
    }
  }
}
