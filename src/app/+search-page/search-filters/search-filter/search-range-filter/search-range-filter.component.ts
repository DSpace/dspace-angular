import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { RemoteDataBuildService } from '../../../../core/cache/builders/remote-data-build.service';
import { FilterType } from '../../../search-service/filter-type.model';
import { renderFacetFor } from '../search-filter-type-decorator';
import {
  facetLoad,
  SearchFacetFilterComponent
} from '../search-facet-filter/search-facet-filter.component';
import { SearchFilterConfig } from '../../../search-service/search-filter-config.model';
import { FILTER_CONFIG, SearchFilterService } from '../search-filter.service';
import { SearchService } from '../../../search-service/search.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { RouteService } from '../../../../shared/services/route.service';
import { hasValue } from '../../../../shared/empty.util';
import { Subscription } from 'rxjs/Subscription';
import { SearchConfigurationService } from '../../../search-service/search-configuration.service';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
const minSuffix = '.min';
const maxSuffix = '.max';
const dateFormats = ['YYYY', 'YYYY-MM', 'YYYY-MM-DD'];
const rangeDelimiter = '-';

@Component({
  selector: 'ds-search-range-filter',
  styleUrls: ['./search-range-filter.component.scss'],
  templateUrl: './search-range-filter.component.html',
  animations: [facetLoad]
})

/**
 * Component that represents a range facet for a specific filter configuration
 */
@renderFacetFor(FilterType.range)
export class SearchRangeFilterComponent extends SearchFacetFilterComponent implements OnInit, OnDestroy {
  /**
   * Fallback minimum for the range
   */
  min = 1950;

  /**
   * Fallback maximum for the range
   */
  max = 2018;

  /**
   * The current range of the filter
   */
  range;

  /**
   * Subscription to unsubscribe from
   */
  sub: Subscription;

  constructor(protected searchService: SearchService,
              protected filterService: SearchFilterService,
              protected searchConfigService: SearchConfigurationService,
              protected router: Router,
              protected rdbs: RemoteDataBuildService,
              @Inject(FILTER_CONFIG) public filterConfig: SearchFilterConfig,
              @Inject(PLATFORM_ID) private platformId: any,
              private route: RouteService) {
    super(searchService, filterService, searchConfigService, rdbs, router, filterConfig);

  }

  /**
   * Initialize with the min and max values as configured in the filter configuration
   * Set the initial values of the range
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.min = moment(this.filterConfig.minValue, dateFormats).year() || this.min;
    this.max = moment(this.filterConfig.maxValue, dateFormats).year() || this.max;
    const iniMin = this.route.getQueryParameterValue(this.filterConfig.paramName + minSuffix).startWith(undefined);
    const iniMax = this.route.getQueryParameterValue(this.filterConfig.paramName + maxSuffix).startWith(undefined);
    this.sub = Observable.combineLatest(iniMin, iniMax, (min, max) => {
      const minimum = hasValue(min) ? min : this.min;
      const maximum = hasValue(max) ? max : this.max;
      return [minimum, maximum]
    }).subscribe((minmax) => this.range = minmax);
  }

  /**
   * Calculates the parameters that should change if a given values for this range filter would be changed
   * @param {string} value The values that are changed for this filter
   * @returns {Observable<any>} The changed filter parameters
   */
  getChangeParams(value: string) {
    const parts = value.split(rangeDelimiter);
    const min = parts.length > 1 ? parts[0].trim() : value;
    const max = parts.length > 1 ? parts[1].trim() : value;
    return Observable.of(
      {
        [this.filterConfig.paramName + minSuffix]: [min],
        [this.filterConfig.paramName + maxSuffix]: [max],
        page: 1
      });
  }

  /**
   * Submits new custom range values to the range filter from the widget
   */
  onSubmit() {
    const newMin = this.range[0] !== this.min ? [this.range[0]] : null;
    const newMax = this.range[1] !== this.max ? [this.range[1]] : null;
    this.router.navigate([this.getSearchLink()], {
      queryParams:
        {
          [this.filterConfig.paramName + minSuffix]: newMin,
          [this.filterConfig.paramName + maxSuffix]: newMax
        },
      queryParamsHandling: 'merge'
    });
    this.filter = '';
  }

  /**
   * TODO when upgrading nouislider, verify that this check is still needed.
   * Prevents AoT bug
   * @returns {boolean} True if the platformId is a platform browser
   */
  shouldShowSlider(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy() {
    super.ngOnDestroy();
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }

  out(call) {
    console.log(call);
  }
}
