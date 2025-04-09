import { Component } from '@angular/core';
import { SEARCH_CONFIG_SERVICE } from 'src/app/my-dspace-page/my-dspace-configuration.service';

import { SearchConfigurationService } from '../../../../app/core/shared/search/search-configuration.service';
import { SearchPageComponent as BaseComponent } from '../../../../app/search-page/search-page.component';
import { ThemedSearchComponent } from '../../../../app/shared/search/themed-search.component';

@Component({
  selector: 'ds-themed-search-page',
  // styleUrls: ['./search-page.component.scss'],
  // templateUrl: './search-page.component.html'
  templateUrl: '../../../../app/search-page/search-page.component.html',
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
export class SearchPageComponent extends BaseComponent {}

