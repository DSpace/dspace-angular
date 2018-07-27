import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search-service/search.service';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { PaginatedSearchOptions } from '../paginated-search-options.model';
import { SearchFilterService } from '../search-filters/search-filter/search-filter.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ds-search-settings',
  styleUrls: ['./search-settings.component.scss'],
  templateUrl: './search-settings.component.html'
})

/**
 * This component represents the part of the search sidebar that contains the general search settings.
 */
export class SearchSettingsComponent implements OnInit {

  /**
   * The configuration for the current paginated search results
   */
  searchOptions$: Observable<PaginatedSearchOptions>;

  /**
   * All sort options that are shown in the settings
   */
  searchOptionPossibilities = [new SortOptions('score', SortDirection.DESC), new SortOptions('dc.title', SortDirection.ASC), new SortOptions('dc.title', SortDirection.DESC)];

  /**
   * Default values for the Search Options
   */
  defaults = {
    pagination: {
      id: 'search-results-pagination',
      pageSize: 10
    },
    sort: new SortOptions('score', SortDirection.DESC),
    query: '',
    scope: ''
  };

  constructor(private service: SearchService,
              private route: ActivatedRoute,
              private router: Router,
              private filterService: SearchFilterService) {
  }

  /**
   * Initialize paginated search options
   */
  ngOnInit(): void {
    this.searchOptions$ = this.filterService.getPaginatedSearchOptions(this.defaults);
  }

  /**
   * Method to change the current page size (results per page)
   * @param {Event} event Change event containing the new page size value
   */
  reloadRPP(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        pageSize: value,
      },
      queryParamsHandling: 'merge'
    };
    this.router.navigate([ '/search' ], navigationExtras);
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
        sortField: values[0]
      },
      queryParamsHandling: 'merge'
    };
    this.router.navigate([ '/search' ], navigationExtras);
  }
}
