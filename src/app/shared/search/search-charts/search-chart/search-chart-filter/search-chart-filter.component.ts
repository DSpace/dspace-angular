import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ChartType } from '../../../../../charts/models/chart-type';
import { SearchFacetFilterComponent } from '../../../search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { ChartData } from '../../../../../charts/models/chart-data';
import { ChartSeries } from '../../../../../charts/models/chart-series';
import { FacetValue } from '../../../facet-value.model';
import { isNotEmpty } from '../../../../empty.util';
import { RemoteData } from '../../../../../core/data/remote-data';
import { PaginatedList } from '../../../../../core/data/paginated-list.model';

@Component({
  selector: 'ds-search-chart-filter',
  template: ``,
})
/**
 * Component that represents a text search chart for a specific configuration
 */
export class SearchChartFilterComponent extends SearchFacetFilterComponent implements OnInit {
  /**
   * for the ChartType
   */
  chartType = ChartType;

  /**
   * Used to set width and height of the chart
   */
  view: any[] = null;

  /**
   * Emits an array of ChartSeries with values found for this chart
   */
  results: Observable<ChartSeries[]|ChartData[]>;

  ngOnInit() {
    super.ngOnInit();
    this.results = this.getInitData();
  }

  protected getInitData(): Observable<ChartSeries[]|ChartData[]> {
    return this.filterValues$.pipe(
      filter((rd: RemoteData<Array<PaginatedList<FacetValue>>>) => isNotEmpty(rd.payload)),
      map((rd: RemoteData<Array<PaginatedList<FacetValue>>>) => rd.payload[0]),
      map((values: PaginatedList<FacetValue>) => {
        return values.page.map((item) => ({
          name: item.value,
          value: item.count,
          extra: item,
        }));
      })
    );
  }

  select(data) {
    /* tslint:disable-next-line */
    const queryParam = this.router['browserUrlTree'].queryParamMap.params;
    const key = this.filterConfig.paramName;
    let value = queryParam[this.filterConfig.paramName];
    if (queryParam[key]) {
      if (queryParam[key].indexOf(data.extra.value) !== -1) {
        value.splice(value.indexOf(data.extra.value), 1);
      } else {
        value.push(data.extra.value);
      }
    } else {
      value = value ? value : [];
      value.push(data.extra.value);
    }
    this.router.navigate(this.getSearchLinkParts(), {
      queryParams: {
        [key]: [...value],
      },
      queryParamsHandling: 'merge',
    });
  }
}
