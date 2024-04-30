import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
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
import { map } from 'rxjs/operators';

import { PaginationService } from '../../../../../../core/pagination/pagination.service';
import { SearchService } from '../../../../../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../../../../../core/shared/search/search-configuration.service';
import { SearchFilterService } from '../../../../../../core/shared/search/search-filter.service';
import { currentPath } from '../../../../../utils/route.utils';
import { ShortNumberPipe } from '../../../../../utils/short-number.pipe';
import { FacetValue } from '../../../../models/facet-value.model';
import { SearchFilterConfig } from '../../../../models/search-filter-config.model';
import { getFacetValueForType } from '../../../../search.utils';

@Component({
  selector: 'ds-search-facet-option',
  styleUrls: ['./search-facet-option.component.scss'],
  templateUrl: './search-facet-option.component.html',
  standalone: true,
  imports: [NgIf, RouterLink, AsyncPipe, TranslateModule, ShortNumberPipe],
})

/**
 * Represents a single option in a filter facet
 */
export class SearchFacetOptionComponent implements OnInit {
  /**
   * A single value for this component
   */
  @Input() filterValue: FacetValue;

  /**
   * The filter configuration for this facet option
   */
  @Input() filterConfig: SearchFilterConfig;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch: boolean;

  /**
   * Emits true when this option should be visible and false when it should be invisible
   */
  isVisible: Observable<boolean>;

  /**
   * UI parameters when this filter is added
   */
  addQueryParams$: Observable<Params>;

  /**
   * Link to the search page
   */
  searchLink: string;

  paginationId: string;

  constructor(protected searchService: SearchService,
              protected filterService: SearchFilterService,
              protected searchConfigService: SearchConfigurationService,
              protected router: Router,
              protected paginationService: PaginationService,
  ) {
  }

  /**
   * Initializes all observable instance variables and starts listening to them
   */
  ngOnInit(): void {
    this.paginationId = this.searchConfigService.paginationID;
    this.searchLink = this.getSearchLink();
    this.isVisible = this.isChecked().pipe(map((checked: boolean) => !checked));
    this.addQueryParams$ = this.updateAddParams();
  }

  /**
   * Checks if a value for this filter is currently active
   */
  isChecked(): Observable<boolean> {
    return this.filterService.isFilterActiveWithValue(this.filterConfig.paramName, this.getFacetValue());
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

  /**
   * Calculates the parameters that should change if this {@link filterValue} would be added to the active filters
   */
  updateAddParams(): Observable<Params> {
    return this.searchConfigService.selectNewAppliedFilterParams(this.filterConfig.name, this.getFacetValue());
  }

  /**
   * Retrieve facet value related to facet type
   */
  getFacetValue(): string {
    return getFacetValueForType(this.filterValue, this.filterConfig);
  }

}
