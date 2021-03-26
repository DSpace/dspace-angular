import { Component, Injector, Input, OnInit, SimpleChanges } from '@angular/core';
import { GenericConstructor } from '../../../../../core/shared/generic-constructor';
import { FILTER_CONFIG, IN_PLACE_SEARCH } from '../../../../../core/shared/search/search-filter.service';
import { FilterType } from '../../../filter-type.model';
import { SearchFilterConfig } from '../../../search-filter-config.model';
import { SearchFacetFilterComponent } from '../../../search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { renderChartFilterType } from '../../chart-search-result-element-decorator';

@Component({
  selector: 'ds-search-chart-wrapper',
  templateUrl: './search-chart-wrapper.component.html',
})

/**
 * Wrapper component that renders a specific chart facet filter based on the filter config's type
 */
export class SearchChartFilterWrapperComponent implements OnInit {
  /**
   * Configuration for the filter of this wrapper component
   */
  @Input() filterConfig: SearchFilterConfig;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;

  /**
   * The constructor of the search facet filter that should be rendered, based on the filter config's type
   */
  searchFilter: GenericConstructor<SearchFacetFilterComponent>;
  /**
   * Injector to inject a child component with the @Input parameters
   */
  objectInjector: Injector;

  constructor(private injector: Injector) {
  }

  /**
   * Initialize and add the filter config to the injector
   */
  ngOnInit(): void {
    this.searchFilter = this.getSearchFilter();
    this.objectInjector = Injector.create({
      providers: [
        { provide: FILTER_CONFIG, useFactory: () => (this.filterConfig), deps: [] },
        { provide: IN_PLACE_SEARCH, useFactory: () => (this.inPlaceSearch), deps: [] }
      ],
      parent: this.injector
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filterConfig = changes.filterConfig.currentValue;
    this.ngOnInit();
  }

  /**
   * Find the correct component based on the filter config's type
   */
  getSearchFilter() {
    const type: FilterType = this.filterConfig.filterType;
    return renderChartFilterType(type);
  }
}
