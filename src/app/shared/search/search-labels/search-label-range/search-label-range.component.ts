import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Params, Router } from '@angular/router';
import { SearchService } from '../../../../core/shared/search/search.service';
import { currentPath } from '../../../utils/route.utils';
import { AppliedFilter } from '../../models/applied-filter.model';
import { renderSearchLabelFor } from '../search-label-loader/search-label-loader.decorator';
import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';

/**
 * Component that represents the label containing the currently active filters
 */
@Component({
  selector: 'ds-search-label-range',
  templateUrl: './search-label-range.component.html',
})
@renderSearchLabelFor('range')
export class SearchLabelRangeComponent implements OnInit {

  @Input() inPlaceSearch: boolean;

  @Input() appliedFilter: AppliedFilter;

  searchLink: string;

  removeParametersMin: Observable<Params>;

  removeParametersMax: Observable<Params>;

  min: string;

  max: string;

  constructor(
    protected searchConfigurationService: SearchConfigurationService,
    protected searchService: SearchService,
    protected router: Router,
  ) {
  }

  ngOnInit(): void {
    this.searchLink = this.getSearchLink();
    this.min = this.appliedFilter.value.substring(1, this.appliedFilter.value.indexOf('TO') - 1);
    this.max = this.appliedFilter.value.substring(this.appliedFilter.value.indexOf('TO') + 3, this.appliedFilter.value.length - 1);
    this.removeParametersMin = this.searchConfigurationService.getParamsWithoutAppliedFilter(`${this.appliedFilter.filter}.min`, this.min);
    this.removeParametersMax = this.searchConfigurationService.getParamsWithoutAppliedFilter(`${this.appliedFilter.filter}.max`, this.max);
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
