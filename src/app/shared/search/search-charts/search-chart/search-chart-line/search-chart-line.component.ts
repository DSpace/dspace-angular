import { Component } from '@angular/core';

import { FilterType } from '../../../models/filter-type.model';
import { facetLoad } from '../../../search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { renderChartFor } from '../../chart-search-result-element-decorator';
import { SearchChartFilterComponent } from '../search-chart-filter/search-chart-filter.component';
import { filter, map } from 'rxjs/operators';
import { ChartData } from '../../../../../charts/models/chart-data';
import { Observable } from 'rxjs';
import { RemoteData } from '../../../../../core/data/remote-data';
import { PaginatedList } from '../../../../../core/data/paginated-list.model';
import { FacetValue } from '../../../models/facet-value.model';
import { isNotEmpty } from '../../../../empty.util';
import { FacetValues } from '../../../models/facet-values.model';

@Component({
  selector: 'ds-search-chart-line',
  styleUrls: ['./search-chart-line.component.scss'],
  templateUrl: './search-chart-line.component.html',
  animations: [facetLoad]
})
/**
 * Component that represents a search line chart filter
 */
@renderChartFor(FilterType['chart.line'])
export class SearchChartLineComponent extends SearchChartFilterComponent {

  protected getInitData(): Observable<ChartData[]> {
    return this.filterValues$.pipe(
      filter((rd: RemoteData<PaginatedList<FacetValue>[]>) => isNotEmpty(rd.payload)),
      map((rd: RemoteData<PaginatedList<FacetValue>[]>) => rd.payload[0]),
      map((facet: FacetValues) => ([{
        name: this.filter,
        series: facet.page.map((item) => ({
          name: item.value,
          value: item.count,
          extra: item,
        })),
      }] as ChartData[]))
    );
  }
}
