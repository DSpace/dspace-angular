import { facetLoad } from '../../../search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { Component } from '@angular/core';
import { FilterType } from '../../../models/filter-type.model';
import { renderChartFor } from '../../chart-search-result-element-decorator';
import { SearchChartFilterComponent } from '../search-chart-filter/search-chart-filter.component';

@Component({
  selector: 'ds-search-chart-horizontal',
  templateUrl: './search-chart-horizontal.component.html',
  styleUrls: ['./search-chart-horizontal.component.scss'],
  animations: [facetLoad],
})
/**
 * Component that represents a search horizontal bar chart filter
 */
@renderChartFor(FilterType['chart.bar.horizontal'])
export class SearchChartHorizontalComponent extends SearchChartFilterComponent {}
