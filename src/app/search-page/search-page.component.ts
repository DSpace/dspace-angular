import { Component } from '@angular/core';

import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../my-dspace-page/my-dspace-configuration.service';
import { ThemedSearchComponent } from '../shared/search/themed-search.component';

@Component({
  selector: 'ds-base-search-page',
  templateUrl: './search-page.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
  standalone: true,
  imports: [ThemedSearchComponent],
})
/**
 * This component represents the whole search page
 * It renders search results depending on the current search options
 */
export class SearchPageComponent {
}
