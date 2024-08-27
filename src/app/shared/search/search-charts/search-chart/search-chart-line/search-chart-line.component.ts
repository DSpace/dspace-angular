import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  filter,
  map,
} from 'rxjs/operators';

import { ChartComponent } from '../../../../../charts/components/chart/chart.component';
import { ChartData } from '../../../../../charts/models/chart-data';
import { isNotEmpty } from '../../../../empty.util';
import { FacetValues } from '../../../models/facet-values.model';
import { facetLoad } from '../../../search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { SearchChartFilterComponent } from '../search-chart-filter/search-chart-filter.component';

@Component({
  selector: 'ds-search-chart-line',
  styleUrls: ['./search-chart-line.component.scss'],
  templateUrl: './search-chart-line.component.html',
  animations: [facetLoad],
  imports: [
    ChartComponent,
    NgIf,
    AsyncPipe,
    TranslateModule,
  ],
  standalone: true,
})
/**
 * Component that represents a search line chart filter
 */
export class SearchChartLineComponent extends SearchChartFilterComponent {

  protected getInitData(): Observable<ChartData[]> {
    return this.facetValues$.pipe(
      filter((facetValues: FacetValues[]) => isNotEmpty(facetValues)),
      map((facetValues: FacetValues[]) => facetValues[0]),
      map((facet: FacetValues) => ([{
        name: this.filter,
        series: facet.page.map((item) => ({
          name: item.value,
          value: item.count,
          extra: item,
        })),
      }] as ChartData[])),
    );
  }
}
