import { NgComponentOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { GenericConstructor } from '../../../../../core/shared/generic-constructor';
import { FilterType } from '../../../models/filter-type.model';
import { SearchFilterConfig } from '../../../models/search-filter-config.model';
import { SearchFacetFilterComponent } from '../../../search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { renderChartFilterType } from '../../chart-search-result-element-decorator';

@Component({
  selector: 'ds-search-chart-wrapper',
  templateUrl: './search-chart-wrapper.component.html',
  imports: [
    NgComponentOutlet,
  ],
  standalone: true,
})

/**
 * Wrapper component that renders a specific chart facet filter based on the filter config's type
 */
export class SearchChartFilterWrapperComponent implements OnChanges, AfterViewInit {
  /**
   * Configuration for the filter of this wrapper component
   */
  @Input() filterConfig: SearchFilterConfig;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;

  /**
   * Emits when the search filters values may be stale, and so they must be refreshed.
   */
  @Input() refreshFilters: BehaviorSubject<boolean>;

  /**
   * The scope of the search.
   */
  @Input() scope: string;

  /**
   * The constructor of the search facet filter that should be rendered, based on the filter config's type
   */
  searchFilter: GenericConstructor<SearchFacetFilterComponent>;

  /**
   * Injector to inject a child component with the @Input parameters
   */
  @ViewChild('containerCharts', { read: ViewContainerRef }) vcr!: ViewContainerRef;

  ngAfterViewInit(): void {
    this.createFilterComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filterConfig && changes.filterConfig.currentValue !== changes.filterConfig.previousValue) {
      this.filterConfig = changes.filterConfig.currentValue;
      this.createFilterComponent();
    }
  }

  /**
   * Find the correct component based on the filter config's type
   */
  getSearchFilter() {
    const type: FilterType = this.filterConfig.filterType;
    return renderChartFilterType(type);
  }

  /**
   * Initialize and add the filter config to the injector
   */
  private createFilterComponent() {
    if (this.vcr) {
      this.searchFilter = this.getSearchFilter();
      this.vcr.clear();
      const componentRef = this.vcr.createComponent(this.searchFilter);
      componentRef.setInput('filterConfig', this.filterConfig);
      componentRef.setInput('inPlaceSearch', this.inPlaceSearch);
      componentRef.setInput('refreshFilters', this.refreshFilters);
      componentRef.setInput('scope', this.scope);
    }
  }
}
