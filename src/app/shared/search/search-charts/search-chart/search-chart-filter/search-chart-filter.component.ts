import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ChartType } from '../../../../../charts/models/chart-type';
import { SearchFacetFilterComponent } from '../../../search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { ChartData } from '../../../../../charts/models/chart-data';
import { ChartSeries } from '../../../../../charts/models/chart-series';
import { FacetValue } from '../../../facet-value.model';
import { RemoteData } from '../../../../../core/data/remote-data';
import { PaginatedList } from '../../../../../core/data/paginated-list.model';
import { FacetValues } from '../../../facet-values.model';
import { getAllCompletedRemoteData } from '../../../../../core/shared/operators';

@Component({
  selector: 'ds-search-chart-filter',
  template: ``,
})
/**
 * Component that represents a search chart filter
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
  results: Observable<ChartSeries[] | ChartData[]>;

  ngOnInit() {
    super.ngOnInit();
    this.results = this.getInitData();
  }

  protected getInitData(): Observable<ChartSeries[] | ChartData[]> {
    return this.filterValues$.pipe(
      // filter((rd: RemoteData<PaginatedList<FacetValue>[]>) => isNotEmpty(rd.payload)),
      getAllCompletedRemoteData(),
      map((facetValues: RemoteData<PaginatedList<FacetValue>[]>) => {
        const values = [];
        facetValues.payload.forEach((facetValue: FacetValues) => {
          values.push(...facetValue.page.map((item: FacetValue) => ({
            name: item.value,
            value: item.count,
            extra: item,
          } as ChartSeries)));
        });
        return values;
      }),
    );
  }

  /**
   * Navigate to route containing selected filter values
   * @param data
   */
  select(data) {
    const links = data.extra._links.search.href.split('?');
    if (links && links.length > 1) {
      const queryParam: any = {};
      links[1].split('&').forEach(res => {
        const str = res.split('=');
        queryParam[str[0]] = queryParam[str[0]] ? [...queryParam[str[0]], str[1]] : [str[1]];
      });
      this.router.navigate(this.getSearchLinkParts(), {
        queryParams: queryParam,
        queryParamsHandling: 'merge',
      });
    }
  }
}
