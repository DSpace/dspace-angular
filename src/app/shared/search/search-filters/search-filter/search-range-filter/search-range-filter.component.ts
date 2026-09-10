import {
  AsyncPipe,
  isPlatformBrowser,
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
import {
  BehaviorSubject,
  combineLatest as observableCombineLatest,
} from 'rxjs';
import {
  map,
  startWith,
} from 'rxjs/operators';
import { yearFromString } from 'src/app/shared/date.util';

import { RemoteDataBuildService } from '../../../../../core/cache/builders/remote-data-build.service';
import { RemoteData } from '../../../../../core/data/remote-data';
import { RouteService } from '../../../../../core/services/route.service';
import { getAllCompletedRemoteData } from '../../../../../core/shared/operators';
import { SearchService } from '../../../../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../../../../core/shared/search/search-configuration.service';
import { SearchFilterService } from '../../../../../core/shared/search/search-filter.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../../my-dspace-page/my-dspace-configuration.service';
import { hasValue } from '../../../../empty.util';
import { DebounceDirective } from '../../../../utils/debounce.directive';
import { Facet } from '../../../models/facet.model';
import { SearchFacetDataService } from '../../../services/search-facet.data.service';
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
  imports: [
    AsyncPipe,
    DebounceDirective,
    FormsModule,
    NouisliderComponent,
    SearchFacetRangeOptionComponent,
    TranslateModule,
  ],
})

/**
 * Component that represents a range facet for a specific filter configuration
 */
export class SearchRangeFilterComponent extends SearchFacetFilterComponent implements OnInit {
  /**
   * Fallback minimum for the range
   */
  minDefault = 1950;
  min$ = new BehaviorSubject(this.minDefault);

  /**
   * i18n Label to use for minimum field
   */
  minLabel: string;

  /**
   * Fallback maximum for the range
   */
  maxDefault = new Date().getUTCFullYear();
  max$ = new BehaviorSubject(this.maxDefault);

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
   * The range currently selected by the slider
   */
  sliderRange: [number | undefined, number | undefined];

  /**
   * Whether the sider is being controlled by the keyboard.
   * Suppresses any changes until the key is released.
   */
  keyboardControl: boolean;

  constructor(protected searchService: SearchService,
              protected facetService: SearchFacetDataService,
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
      facetService,
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

    this.subs.push(
      this.facet$.pipe(getAllCompletedRemoteData()).subscribe((facetRD: RemoteData<Facet>) => {
        if (facetRD.hasSucceeded) {
          this.min$.next(yearFromString(facetRD.payload.minValue) || this.minDefault);
          this.max$.next(yearFromString(facetRD.payload.maxValue) || this.maxDefault);
        } else {
          this.min$.next(this.minDefault);
          this.max$.next(this.maxDefault);
        }
      }),
    );

    this.minLabel = this.translateService.instant('search.filters.filter.' + this.filterConfig.name + '.min.placeholder');
    this.maxLabel = this.translateService.instant('search.filters.filter.' + this.filterConfig.name + '.max.placeholder');
    const iniMin = this.route.getQueryParameterValue(this.filterConfig.paramName + RANGE_FILTER_MIN_SUFFIX).pipe(startWith(undefined));
    const iniMax = this.route.getQueryParameterValue(this.filterConfig.paramName + RANGE_FILTER_MAX_SUFFIX).pipe(startWith(undefined));
    this.subs.push(observableCombineLatest([iniMin, iniMax, this.min$, this.max$]).pipe(
      map(([min, max, currentMin, currentMax]: [string, string, number, number]) => {
        const minimum = hasValue(min) ? Number(min) : currentMin;
        const maximum = hasValue(max) ? Number(max) : currentMax;
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
   * Updates the sliderRange property with the current slider range.
   * This method is called whenever the slider value changes, but it does not immediately apply the changes.
   * @param range - The current range selected by the slider
   */
  onSliderChange(range: [number | undefined, number | undefined]): void {
    this.sliderRange = range;
  }

  /**
   * Submits new custom range values to the range filter from the widget
   */
  onSubmit() {
    if (this.keyboardControl) {
      return;  // don't submit if a key is being held down
    }

    const newMin = this.range[0] !== this.min$.value ? [this.range[0]] : null;
    const newMax = this.range[1] !== this.max$.value ? [this.range[1]] : null;
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
