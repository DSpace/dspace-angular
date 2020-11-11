import { Component, OnInit } from '@angular/core';
import { ChartType } from '../../../../enums/chart-type';
import { ChartSeries } from '../../../../models/chart-series';
import { FilterType } from '../../../filter-type.model';
import { facetLoad, SearchFacetFilterComponent } from '../../../search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { renderChartFor } from '../../chart-search-result-element-decorator';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-chart-bar',
  styleUrls: ['./search-chart-bar.component.scss'],
  templateUrl: './search-chart-bar.component.html',
  animations: [facetLoad],
})
/**
 * Component that represents a text facet for a specific configuration
 */
@renderChartFor(FilterType['chart.bar'])
export class SearchChartBarComponent extends SearchFacetFilterComponent implements OnInit {

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
