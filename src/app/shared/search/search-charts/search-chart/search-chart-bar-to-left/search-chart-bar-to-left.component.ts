import { Component, OnInit } from '@angular/core';

import { FilterType } from '../../../filter-type.model';
import { facetLoad } from '../../../search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { renderChartFor } from '../../chart-search-result-element-decorator';
import { SearchChartFilterComponent } from '../search-chart-filter/search-chart-filter.component';

@Component({
  selector: 'ds-search-chart-bar-to-left',
  styleUrls: ['./search-chart-bar-to-left.component.scss'],
  templateUrl: './search-chart-bar-to-left.component.html',
  animations: [facetLoad],
})
/**
 * Component that represents a search bar-to-left chart filter
 */
@renderChartFor(FilterType['chart.bar.right-to-left'])
export class SearchChartBarToLeftComponent extends SearchChartFilterComponent implements OnInit {

}
