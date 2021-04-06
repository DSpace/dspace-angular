import { Component, Inject, Input } from '@angular/core';
import { SearchService } from '../../../core/shared/search/search.service';
import { SortOptions } from '../../../core/cache/models/sort-options.model';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { PaginatedSearchOptions } from '../paginated-search-options.model';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../+my-dspace-page/my-dspace-page.component';

@Component({
  selector: 'ds-search-settings',
  styleUrls: ['./search-settings.component.scss'],
  templateUrl: './search-settings.component.html'
})

/**
 * This component represents the part of the search sidebar that contains the general search settings.
 */
export class SearchSettingsComponent {

  /**
   * The configuration for the current paginated search results
   */
  @Input() searchOptions: PaginatedSearchOptions;

  /**
   * All sort options that are shown in the settings
   */
  @Input() sortOptions: SortOptions[];

  constructor(private service: SearchService,
              private route: ActivatedRoute,
              private router: Router,
              @Inject(SEARCH_CONFIG_SERVICE) public searchConfigurationService: SearchConfigurationService) {
  }

  /**
   * Method to change the current sort field and direction
   * @param {Event} event Change event containing the sort direction and sort field
   */
  reloadOrder(event: Event) {
    const values = (event.target as HTMLInputElement).value.split(',');
    const navigationExtras: NavigationExtras = {
      queryParams: {
        sortDirection: values[1],
        sortField: values[0],
        page: 1
      },
      queryParamsHandling: 'merge'
    };
    this.router.navigate([], navigationExtras);
  }
}
