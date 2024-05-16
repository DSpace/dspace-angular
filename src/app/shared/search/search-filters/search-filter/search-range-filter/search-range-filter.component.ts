import {
  AsyncPipe,
  isPlatformBrowser,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { NouisliderComponent } from 'ng2-nouislider';
import { combineLatest as observableCombineLatest } from 'rxjs';
import {
  map,
  startWith,
} from 'rxjs/operators';
import { yearFromString } from 'src/app/shared/date.util';

import { RemoteDataBuildService } from '../../../../../core/cache/builders/remote-data-build.service';
import { RouteService } from '../../../../../core/services/route.service';
import { SearchService } from '../../../../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../../../../core/shared/search/search-configuration.service';
import { SearchFilterService } from '../../../../../core/shared/search/search-filter.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../../my-dspace-page/my-dspace-configuration.service';
import { hasValue } from '../../../../empty.util';
import { DebounceDirective } from '../../../../utils/debounce.directive';
import {
  facetLoad,
  SearchFacetFilterComponent,
} from '../search-facet-filter/search-facet-filter.component';
import { SearchFacetRangeOptionComponent } from '../search-facet-filter-options/search-facet-range-option/search-facet-range-option.component';
import {
  RANGE_FILTER_MAX_SUFFIX,
  RANGE_FILTER_MIN_SUFFIX,
} from './search-range-filter-constants';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
@Component({
  selector: 'ds-search-range-filter',
  styleUrls: ['./search-range-filter.component.scss'],
  templateUrl: './search-range-filter.component.html',
  animations: [facetLoad],
  standalone: true,
  imports: [FormsModule, NgIf, NouisliderComponent, DebounceDirective, NgFor, SearchFacetRangeOptionComponent, AsyncPipe, TranslateModule],
})

/**
 * Component that represents a range facet for a specific filter configuration
 */
export class SearchRangeFilterComponent extends SearchFacetFilterComponent implements OnInit {
  /**
   * Fallback minimum for the range
   */
  min = 1950;

  /**
   * i18n Label to use for minimum field
   */
  minLabel: string;

  /**
   * Fallback maximum for the range
   */
  max = new Date().getUTCFullYear();

  /**
   * i18n Label to use for maximum field
   */
  maxLabel: string;

  /**
   * Base configuration for nouislider
   * https://refreshless.com/nouislider/slider-options/
   */
  config = {};

  /**
   * The current range of the filter
   */
  range: [number | undefined, number | undefined];

  /**
   * Whether the sider is being controlled by the keyboard.
   * Supresses any changes until the key is released.
   */
  keyboardControl: boolean;

  constructor(protected searchService: SearchService,
              protected filterService: SearchFilterService,
              protected router: Router,
              protected route: RouteService,
              protected rdbs: RemoteDataBuildService,
              private translateService: TranslateService,
              @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
              @Inject(PLATFORM_ID) private platformId: any,
  ) {
    super(
      searchService,
      filterService,
      rdbs,
      router,
      searchConfigService,
    );
  }

  /**
   * Initialize with the min and max values as configured in the filter configuration
   * Set the initial values of the range
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.min = yearFromString(this.filterConfig.minValue) || this.min;
    this.max = yearFromString(this.filterConfig.maxValue) || this.max;
    this.minLabel = this.translateService.instant('search.filters.filter.' + this.filterConfig.name + '.min.placeholder');
    this.maxLabel = this.translateService.instant('search.filters.filter.' + this.filterConfig.name + '.max.placeholder');
    const iniMin = this.route.getQueryParameterValue(this.filterConfig.paramName + RANGE_FILTER_MIN_SUFFIX).pipe(startWith(undefined));
    const iniMax = this.route.getQueryParameterValue(this.filterConfig.paramName + RANGE_FILTER_MAX_SUFFIX).pipe(startWith(undefined));
    this.subs.push(observableCombineLatest([iniMin, iniMax]).pipe(
      map(([min, max]: [string, string]) => {
        const minimum = hasValue(min) ? Number(min) : this.min;
        const maximum = hasValue(max) ? Number(max) : this.max;
        return [minimum, maximum];
      }),
    ).subscribe((minmax: [number, number]) => this.range = minmax));

    // Default/base config for nouislider
    this.config = {
      // Ensure draggable handles have labels
      handleAttributes: [
        { 'aria-label': this.minLabel },
        { 'aria-label': this.maxLabel },
      ],
    };
  }

  /**
   * Submits new custom range values to the range filter from the widget
   */
  onSubmit() {
    if (this.keyboardControl) {
      return;  // don't submit if a key is being held down
    }

    const newMin = this.range[0] !== this.min ? [this.range[0]] : null;
    const newMax = this.range[1] !== this.max ? [this.range[1]] : null;
    void this.router.navigate(this.getSearchLinkParts(), {
      queryParams:
        {
          [this.filterConfig.paramName + RANGE_FILTER_MIN_SUFFIX]: newMin,
          [this.filterConfig.paramName + RANGE_FILTER_MAX_SUFFIX]: newMax,
        },
      queryParamsHandling: 'merge',
    });
    this.filter = '';
  }

  startKeyboardControl(): void {
    this.keyboardControl = true;
  }

  stopKeyboardControl(): void {
    this.keyboardControl = false;
  }

  /**
   * TODO when upgrading nouislider, verify that this check is still needed.
   * Prevents AoT bug
   * @returns {boolean} True if the platformId is a platform browser
   */
  shouldShowSlider(): boolean {
    return isPlatformBrowser(this.platformId);
  }

}
