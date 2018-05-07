import { Component, Input } from '@angular/core';
import { RemoteData } from '../../core/data/remote-data';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { fadeIn, fadeInOut } from '../../shared/animations/fade';
import { SearchOptions, ViewMode } from '../search-options.model';
import { SortOptions } from '../../core/cache/models/sort-options.model';
import { SearchResult } from '../search-result.model';
import { PaginatedList } from '../../core/data/paginated-list';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
@Component({
  selector: 'ds-search-results',
  templateUrl: './search-results.component.html',
  animations: [
    fadeIn,
    fadeInOut
  ]
})
export class SearchResultsComponent {
  @Input() searchResults: RemoteData<PaginatedList<SearchResult<DSpaceObject>>>;
  @Input() searchConfig: SearchOptions;
  @Input() sortConfig: SortOptions;
  @Input() viewMode: ViewMode;
}
