import { combineLatest as observableCombineLatest, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FacetValue } from '../../../../models/facet-value.model';
import { SearchFilterConfig } from '../../../../models/search-filter-config.model';
import { SearchService } from '../../../../../../core/shared/search/search.service';
import { SearchFilterService } from '../../../../../../core/shared/search/search-filter.service';
import { LiveRegionService } from '../../../../../../shared/live-region/live-region.service';
import { SearchConfigurationService } from '../../../../../../core/shared/search/search-configuration.service';
import { hasValue } from '../../../../../empty.util';
import { currentPath } from '../../../../../utils/route.utils';
import { getFacetValueForType } from '../../../../search.utils';
import { PaginationService } from '../../../../../../core/pagination/pagination.service';

@Component({
  selector: 'ds-search-facet-option',
  styleUrls: ['./search-facet-option.component.scss'],
  templateUrl: './search-facet-option.component.html',
})

/**
 * Represents a single option in a filter facet
 */
export class SearchFacetOptionComponent implements OnInit, OnDestroy {
  /**
   * A single value for this component
   */
  @Input() filterValue: FacetValue;

  /**
   * The filter configuration for this facet option
   */
  @Input() filterConfig: SearchFilterConfig;

  /**
   * Emits the active values for this filter
   */
  @Input() selectedValues$: Observable<FacetValue[]>;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;

  /**
   * Emits true when this option should be visible and false when it should be invisible
   */
  isVisible: Observable<boolean>;

  /**
   * UI parameters when this filter is added
   */
  addQueryParams;

  /**
   * Link to the search page
   */
  searchLink: string;
  /**
   * Subscription to unsubscribe from on destroy
   */
  sub: Subscription;

  paginationId: string;

  configuration: string;
  labelTranslation: string;

  constructor(protected searchService: SearchService,
              protected filterService: SearchFilterService,
              protected searchConfigService: SearchConfigurationService,
              protected router: Router,
              protected activatedRoute: ActivatedRoute,
              protected paginationService: PaginationService,
              protected liveRegionService: LiveRegionService,
              protected translateService: TranslateService,
  ) {
  }

  /**
   * Initializes all observable instance variables and starts listening to them
   */
  ngOnInit(): void {
    this.configuration = this.activatedRoute?.snapshot?.queryParams?.configuration;

    this.handleTranslation();

    this.paginationId = this.searchConfigService.paginationID;
    this.searchLink = this.getSearchLink();
    this.isVisible = this.isChecked().pipe(map((checked: boolean) => !checked));
    this.sub = observableCombineLatest(this.selectedValues$, this.searchConfigService.searchOptions)
      .subscribe(([selectedValues, searchOptions]) => {
        this.updateAddParams(selectedValues);
      });
  }

  /**
   * Handles translation of the label
   */
  handleTranslation() {
    let translation = '';
    const labelWithConfiguration = `search.filters.${this.configuration}.${this.filterConfig.name}.${this.filterValue.value}`;

    translation = this.translateService.instant(labelWithConfiguration);
    if (translation !== labelWithConfiguration) {
      this.labelTranslation = translation;
    } else {
      const labelWithoutConfiguration = `search.filters.${this.filterConfig.name}.${this.filterValue.value}`;
      translation = this.translateService.instant(labelWithoutConfiguration);
      if (translation !== labelWithoutConfiguration) {
        this.labelTranslation = translation;
      } else {
        this.labelTranslation = this.filterValue.value;
      }
    }
  }

  /**
   * Checks if a value for this filter is currently active
   */
  private isChecked(): Observable<boolean> {
    return this.filterService.isFilterActiveWithValue(this.filterConfig.paramName, this.getFacetValue());
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

  /**
   * Calculates the parameters that should change if a given value for this filter would be added to the active filters
   * @param {string[]} selectedValues The values that are currently selected for this filter
   */
  private updateAddParams(selectedValues: FacetValue[]): void {
    const page = this.paginationService.getPageParam(this.searchConfigService.paginationID);
    this.addQueryParams = {
      [this.filterConfig.paramName]: [...selectedValues.map((facetValue: FacetValue) => getFacetValueForType(facetValue, this.filterConfig)), this.getFacetValue()],
      [page]: 1
    };
  }

  /**
   * TODO to review after https://github.com/DSpace/dspace-angular/issues/368 is resolved
   * Retrieve facet value related to facet type
   */
  private getFacetValue(): string {
    return getFacetValueForType(this.filterValue, this.filterConfig);
  }

  /**
   * Make sure the subscription is unsubscribed from when this component is destroyed
   */
  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }

  /**
   * Announces to the screen reader that the page will be reloaded, which filter has been selected
   */
  announceFilter() {
    const message = this.translateService.instant('search-facet-option.update.announcement', { filter: this.filterValue.value });
    this.liveRegionService.addMessage(message);
  }
}
