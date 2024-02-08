import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Params, Router } from '@angular/router';
import { SearchService } from '../../../../core/shared/search/search.service';
import { currentPath } from '../../../utils/route.utils';
import { AppliedFilter } from '../../models/applied-filter.model';
import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';

@Component({
  selector: 'ds-search-label',
  templateUrl: './search-label.component.html',
})

/**
 * Component that represents the label containing the currently active filters
 */
export class SearchLabelComponent implements OnInit {
  @Input() inPlaceSearch: boolean;
  @Input() appliedFilter: AppliedFilter;
  searchLink: string;
  removeParameters: Observable<Params>;

  /**
   * Initialize the instance variable
   */
  constructor(
    protected searchConfigurationService: SearchConfigurationService,
    protected searchService: SearchService,
    protected router: Router,
  ) {
  }

  ngOnInit(): void {
    this.searchLink = this.getSearchLink();
    this.removeParameters = this.searchConfigurationService.getParamsWithoutAppliedFilter(this.appliedFilter.filter, this.appliedFilter.value, this.appliedFilter.operator);
  }

  /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  private getSearchLink(): string {
    if (this.inPlaceSearch) {
      return currentPath(this.router);
    }
    return this.searchService.getSearchLink();
  }

}
