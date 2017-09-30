import { Component, Input } from '@angular/core';
import { RemoteData } from '../../core/data/remote-data';
import { SearchResult } from '../../search/search-result.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { SearchOptions } from '../../search/search-options.model';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-results',
  templateUrl: './search-results.component.html',
})

export class SearchResultsComponent {
  @Input() searchResults: RemoteData<Array<SearchResult<DSpaceObject>>>;
  @Input() searchConfig: SearchOptions;
}
