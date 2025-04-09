/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE_ATMIRE and NOTICE_ATMIRE files at the root of the source
 * tree and available online at
 *
 * https://www.atmire.com/software-license/
 */
import {
  AsyncPipe,
  NgFor,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SearchConfigurationService } from '../../../../../../app/core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../../../app/my-dspace-page/my-dspace-configuration.service';
import { AdvancedSearchComponent } from '../../../../../../app/shared/search/advanced-search/advanced-search.component';
import { SearchFilterComponent } from '../../../../../../app/shared/search/search-filters/search-filter/search-filter.component';
import { SearchFiltersComponent as BaseComponent } from '../../../../../../app/shared/search/search-filters/search-filters.component';


@Component({
  selector: 'ds-themed-search-filters',
  // styleUrls: ['./search-filters.component.scss'],
  styleUrls: ['../../../../../../app/shared/search/search-filters/search-filters.component.scss'],
  // templateUrl: './search-filters.component.html',
  templateUrl: '../../../../../../app/shared/search/search-filters/search-filters.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
  standalone: true,
  imports: [NgIf, NgFor, SearchFilterComponent, RouterLink, AsyncPipe, TranslateModule, AdvancedSearchComponent],
})

export class SearchFiltersComponent extends BaseComponent {
}
