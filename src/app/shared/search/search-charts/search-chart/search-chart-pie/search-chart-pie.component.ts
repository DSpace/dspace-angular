import { Component } from '@angular/core';

import { FilterType } from '../../../filter-type.model';
import { facetLoad } from '../../../search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { renderChartFor } from '../../chart-search-result-element-decorator';
import { SearchChartFilterComponent } from '../search-chart-filter/search-chart-filter.component';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-chart-pie',
  styleUrls: ['./search-chart-pie.component.scss'],
  templateUrl: './search-chart-pie.component.html',
  animations: [facetLoad],
})
/**
 * Component that represents a text facet for a specific filter configuration
 */
@renderChartFor(FilterType['chart.pie'])
export class SearchChartPieComponent extends SearchChartFilterComponent {

}
