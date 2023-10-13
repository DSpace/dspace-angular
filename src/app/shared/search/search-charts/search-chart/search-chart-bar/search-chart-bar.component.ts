import isEqual from 'lodash/isEqual';
import { Component, OnInit } from '@angular/core';

import { FilterType } from '../../../models/filter-type.model';
import { facetLoad } from '../../../search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { renderChartFor } from '../../chart-search-result-element-decorator';
import { SearchChartFilterComponent } from '../search-chart-filter/search-chart-filter.component';

@Component({
  selector: 'ds-search-chart-bar',
  styleUrls: ['./search-chart-bar.component.scss'],
  templateUrl: './search-chart-bar.component.html',
  animations: [facetLoad],
})
/**
 * Component that represents a search bar/reverse-bar chart filter
 */
@renderChartFor(FilterType['chart.bar'])
@renderChartFor(FilterType['chart.reverse-bar'])
export class SearchChartBarComponent extends SearchChartFilterComponent implements OnInit {

  ngOnInit() {
    super.ngOnInit();
    if (
      isEqual(this.filterConfig.filterType, FilterType['chart.reverse-bar'])
    ) {
      this.isReverseChart = true;
    }
  }
}
