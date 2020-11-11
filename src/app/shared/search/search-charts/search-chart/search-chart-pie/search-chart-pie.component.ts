import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChartType } from '../../../../enums/chart-type';
import { ChartSeries } from '../../../../models/chart-series';
import { FilterType } from '../../../filter-type.model';
import {
  facetLoad,
  SearchFacetFilterComponent
} from '../../../search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { renderChartFor } from '../../chart-search-result-element-decorator';

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
export class SearchChartPieComponent extends SearchFacetFilterComponent implements OnInit {

  /**
   * Emits an array of ChartSeries with values found for this chart
   */
  results: Observable<ChartSeries[]>;

  chartType = ChartType;

  view: any[] = [1100, 400];

  ngOnInit() {
    super.ngOnInit();
    this.results = this.filterValues$.pipe(map((result) => result.payload && result.payload.map((res) => {
        return res.page.map((item) => ({
        name: item.value,
        value: item.count
      }))
    })[0]));
  }
}
