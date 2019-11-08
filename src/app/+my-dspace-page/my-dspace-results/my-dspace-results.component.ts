import { Component, Input } from '@angular/core';
import { RemoteData } from '../../core/data/remote-data';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { fadeIn, fadeInOut } from '../../shared/animations/fade';
import { SearchOptions } from '../../+search-page/search-options.model';
import { PaginatedList } from '../../core/data/paginated-list';
import { ViewMode } from '../../core/shared/view-mode.model';
import { isEmpty } from '../../shared/empty.util';
import { SearchResult } from '../../+search-page/search-result.model';
import { Context } from '../../core/shared/context.model';

/**
 * Component that represents all results for mydspace page
 */
@Component({
  selector: 'ds-my-dspace-results',
  templateUrl: './my-dspace-results.component.html',
  animations: [
    fadeIn,
    fadeInOut
  ]
})
export class MyDSpaceResultsComponent {

  /**
   * The actual search result objects
   */
  @Input() searchResults: RemoteData<PaginatedList<SearchResult<DSpaceObject>>>;

  /**
   * The current configuration of the search
   */
  @Input() searchConfig: SearchOptions;

  /**
   * The current view mode for the search results
   */
  @Input() viewMode: ViewMode;

  /**
   * The current context for the search results
   */
  @Input() context: Context;
  /**
   * A boolean representing if search results entry are separated by a line
   */
  hasBorder = true;

  /**
   * Check if mydspace search results are loading
   */
  isLoading() {
    return !this.searchResults || isEmpty(this.searchResults) || this.searchResults.isLoading;
  }
}
