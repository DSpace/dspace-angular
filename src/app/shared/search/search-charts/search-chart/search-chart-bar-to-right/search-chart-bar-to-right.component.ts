import { Component, OnInit } from '@angular/core';

import { FilterType } from '../../../filter-type.model';
import { facetLoad } from '../../../search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { renderChartFor } from '../../chart-search-result-element-decorator';
import { SearchChartFilterComponent } from '../search-chart-filter/search-chart-filter.component';

@Component({
  selector: 'ds-search-chart-bar-to-right',
  styleUrls: ['./search-chart-bar-to-right.component.scss'],
  templateUrl: './search-chart-bar-to-right.component.html',
  animations: [facetLoad],
})
/**
 * Component that represents a search bar-to-right chart filter
 */
@renderChartFor(FilterType['chart.bar.left-to-right'])
export class SearchChartBarToRightComponent extends SearchChartFilterComponent implements OnInit {

}
