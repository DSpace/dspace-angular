import { Component } from '@angular/core';

import { FilterType } from '../../../filter-type.model';
import { facetLoad } from '../../../search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { renderChartFor } from '../../chart-search-result-element-decorator';
import { SearchChartFilterComponent } from '../search-chart-filter/search-chart-filter.component';
import { filter, map } from 'rxjs/operators';
import { ChartData } from '../../../../../charts/models/chart-data';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../../../../core/data/remote-data';
import { PaginatedList } from '../../../../../core/data/paginated-list.model';
import { FacetValue } from '../../../facet-value.model';
import { isNotEmpty } from '../../../../empty.util';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-chart-line',
  styleUrls: ['./search-chart-line.component.scss'],
  templateUrl: './search-chart-line.component.html',
  animations: [facetLoad]
})
/**
 * Component that represents a text facet for a specific configuration
 */
@renderChartFor(FilterType['chart.line'])
export class SearchChartLineComponent extends SearchChartFilterComponent {

  protected getInitData(): Observable<ChartData[]> {
    return this.filterValues$.pipe(
      filter((rd: RemoteData<PaginatedList<FacetValue>[]>) => isNotEmpty(rd.payload)),
      map((result: RemoteData<PaginatedList<FacetValue>[]>) => {
        return result.payload.map((res) => ({
          name: this.filter,
          series: res.page.map((item) => ({
            name: item.value,
            value: item.count,
            extra: item,
          })),
        }));
      })
    );
  }
}
