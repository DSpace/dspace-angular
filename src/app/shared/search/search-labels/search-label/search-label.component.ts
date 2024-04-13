import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Params, Router } from '@angular/router';
import { SearchService } from '../../../../core/shared/search/search.service';
import { currentPath } from '../../../utils/route.utils';
import { AppliedFilter } from '../../models/applied-filter.model';
import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';
import { renderSearchLabelFor } from '../search-label-loader/search-label-loader.decorator';
import { PaginationService } from '../../../../core/pagination/pagination.service';

/**
 * Component that represents the label containing the currently active filters
 */
@Component({
  selector: 'ds-search-label',
  templateUrl: './search-label.component.html',
})
@renderSearchLabelFor()
export class SearchLabelComponent implements OnInit {
  @Input() inPlaceSearch: boolean;
  @Input() appliedFilter: AppliedFilter;
  searchLink: string;
  removeParameters$: Observable<Params>;

  /**
   * Initialize the instance variable
   */
  constructor(
    protected paginationService: PaginationService,
    protected router: Router,
    protected searchConfigurationService: SearchConfigurationService,
    protected searchService: SearchService,
  ) {
  }

  ngOnInit(): void {
    this.searchLink = this.getSearchLink();
    this.removeParameters$ = this.updateRemoveParams();
  }

  /**
   * Calculates the parameters that should change if this {@link appliedFilter} would be removed from the active filters
   */
  updateRemoveParams(): Observable<Params> {
    return this.searchConfigurationService.unselectAppliedFilterParams(this.appliedFilter.filter, this.appliedFilter.value, this.appliedFilter.operator);
  }

  /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  getSearchLink(): string {
    if (this.inPlaceSearch) {
      return currentPath(this.router);
    }
    return this.searchService.getSearchLink();
  }

}
