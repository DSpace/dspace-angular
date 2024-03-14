import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  Params,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PaginationService } from '../../../../core/pagination/pagination.service';
import { SearchService } from '../../../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';
import { currentPath } from '../../../utils/route.utils';
import { AppliedFilter } from '../../models/applied-filter.model';
import { renderSearchLabelFor } from '../search-label-loader/search-label-loader.decorator';

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

  removeParametersMin$: Observable<Params>;

  removeParametersMax$: Observable<Params>;

  min: string;

  max: string;

  constructor(
    protected paginationService: PaginationService,
    protected router: Router,
    protected searchConfigurationService: SearchConfigurationService,
    protected searchService: SearchService,
  ) {
  }

  ngOnInit(): void {
    this.searchLink = this.getSearchLink();
    this.min = this.appliedFilter.value.substring(1, this.appliedFilter.value.indexOf('TO') - 1);
    this.max = this.appliedFilter.value.substring(this.appliedFilter.value.indexOf('TO') + 3, this.appliedFilter.value.length - 1);
    this.removeParametersMin$ = this.updateRemoveParams(`${this.appliedFilter.filter}.min`, this.min);
    this.removeParametersMax$ = this.updateRemoveParams(`${this.appliedFilter.filter}.max`, this.max);
  }

  /**
   * Calculates the parameters that should change if this {@link appliedFilter} would be removed from the active filters
   *
   *  @param filterName The {@link AppliedFilter}'s name
   * @param value The {@link AppliedFilter}'s value
   * @param operator The {@link AppliedFilter}'s optional operator
   */
  updateRemoveParams(filterName: string, value: string, operator?: string): Observable<Params> {
    const page: string = this.paginationService.getPageParam(this.searchConfigurationService.paginationID);
    return this.searchConfigurationService.unselectAppliedFilterParams(filterName, value, operator).pipe(
      map((params: Params) => ({
        ...params,
        [page]: 1,
      })),
    );
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
