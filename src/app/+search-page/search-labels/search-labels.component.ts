import { Component, Inject, Input, OnInit } from '@angular/core';
import { SearchService } from '../search-service/search.service';
import { Observable } from 'rxjs';
import { Params } from '@angular/router';
import { map } from 'rxjs/operators';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { SearchConfigurationService } from '../search-service/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../+my-dspace-page/my-dspace-page.component';

@Component({
  selector: 'ds-search-labels',
  styleUrls: ['./search-labels.component.scss'],
  templateUrl: './search-labels.component.html',
})

/**
 * Component that represents the labels containing the currently active filters
 */
export class SearchLabelsComponent {
  /**
   * Emits the currently active filters
   */
  appliedFilters: Observable<Params>;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;

  /**
   * Initialize the instance variable
   */
  constructor(
    @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService) {
    this.appliedFilters = this.searchConfigService.getCurrentFrontendFilters();
  }
}
