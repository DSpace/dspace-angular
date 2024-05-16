import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  Params,
  Router,
  RouterLink,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { PaginationService } from '../../../../../../core/pagination/pagination.service';
import { SearchService } from '../../../../../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../../../../../core/shared/search/search-configuration.service';
import { SearchFilterService } from '../../../../../../core/shared/search/search-filter.service';
import { currentPath } from '../../../../../utils/route.utils';
import { AppliedFilter } from '../../../../models/applied-filter.model';
import { SearchFilterConfig } from '../../../../models/search-filter-config.model';

@Component({
  selector: 'ds-search-facet-selected-option',
  styleUrls: ['./search-facet-selected-option.component.scss'],
  templateUrl: './search-facet-selected-option.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    TranslateModule,
  ],
})

/**
 * Represents a single selected option in a filter facet
 */
export class SearchFacetSelectedOptionComponent implements OnInit {
  /**
   * The value for this component
   */
  @Input() selectedValue: AppliedFilter;

  /**
   * The filter configuration for this facet option
   */
  @Input() filterConfig: SearchFilterConfig;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch: boolean;

  /**
   * UI parameters when this filter is removed
   */
  removeQueryParams: Observable<Params>;

  /**
   * Link to the search page
   */
  searchLink: string;

  constructor(
    protected paginationService: PaginationService,
    protected router: Router,
    protected searchFilterService: SearchFilterService,
    protected searchService: SearchService,
    protected searchConfigService: SearchConfigurationService,
  ) {
  }

  /**
   * Initializes all observable instance variables and starts listening to them
   */
  ngOnInit(): void {
    this.searchLink = this.getSearchLink();
    this.removeQueryParams = this.updateRemoveParams();
  }

  /**
   * Calculates the parameters that should change if this {@link selectedValue} would be removed from the active filters
   */
  updateRemoveParams(): Observable<Params> {
    return this.searchConfigService.unselectAppliedFilterParams(this.selectedValue.filter, this.selectedValue.value, this.selectedValue.operator);
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
