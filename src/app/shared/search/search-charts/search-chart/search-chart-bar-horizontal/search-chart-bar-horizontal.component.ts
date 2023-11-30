import isEqual from 'lodash/isEqual';
import { facetLoad } from '../../../search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { Component, OnInit } from '@angular/core';
import { FilterType } from '../../../models/filter-type.model';
import { renderChartFor } from '../../chart-search-result-element-decorator';
import { SearchChartFilterComponent } from '../search-chart-filter/search-chart-filter.component';

@Component({
  selector: 'ds-search-chart-bar-horizontal',
  templateUrl: './search-chart-bar-horizontal.component.html',
  styleUrls: ['./search-chart-bar-horizontal.component.scss'],
  animations: [facetLoad],
})
/**
 * Component that represents a search horizontal/reverse-horizontal bar chart filter
 */
@renderChartFor(FilterType['chart.bar.horizontal'])
@renderChartFor(FilterType['chart.reverse-bar.horizontal'])
export class SearchChartBarHorizontalComponent extends SearchChartFilterComponent implements OnInit {

  ngOnInit() {
    super.ngOnInit();
    if (
      isEqual(
        this.filterConfig.filterType,
        FilterType['chart.reverse-bar.horizontal']
      )
    ) {
      this.isReverseChart = true;
    }
  }
}
