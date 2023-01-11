/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE_ATMIRE and NOTICE_ATMIRE files at the root of the source
 * tree and available online at
 *
 * https://www.atmire.com/software-license/
 */
import { Component } from '@angular/core';
import {
  SearchFiltersComponent as BaseComponent,
} from '../../../../../../app/shared/search/search-filters/search-filters.component';
import { SEARCH_CONFIG_SERVICE } from '../../../../../../app/my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../../../app/core/shared/search/search-configuration.service';


@Component({
  selector: 'ds-search-filters',
  // styleUrls: ['./search-filters.component.scss'],
  styleUrls: ['../../../../../../app/shared/search/search-filters/search-filters.component.scss'],
  // templateUrl: './search-filters.component.html',
  templateUrl: '../../../../../../app/shared/search/search-filters/search-filters.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]

})

export class SearchFiltersComponent extends BaseComponent {
}
