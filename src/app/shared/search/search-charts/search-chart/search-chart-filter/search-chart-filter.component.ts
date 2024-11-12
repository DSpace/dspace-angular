import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ChartType } from '../../../../../charts/models/chart-type';
import { SearchFacetFilterComponent } from '../../../search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { ChartData } from '../../../../../charts/models/chart-data';
import { ChartSeries } from '../../../../../charts/models/chart-series';
import { FacetValue } from '../../../models/facet-value.model';
import { RemoteData } from '../../../../../core/data/remote-data';
import { PaginatedList } from '../../../../../core/data/paginated-list.model';
import { FacetValues } from '../../../models/facet-values.model';
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
  view: any[] = [];

  /**
   * Emits an array of ChartSeries with values found for this chart
   */
  results: Observable<ChartSeries[] | ChartData[]>;

  /**
   * Set default horizontal chart label i18n key pattern.
   *
   * @type {string}
   * @memberof SearchChartFilterComponent
   */
  xAxisLabel = 'search.filters.applied.charts.<facet name>.x_label';

  /**
   * Set default vertical chart label i18n key pattern.
   *
   * @type {string}
   * @memberof SearchChartFilterComponent
   */
  yAxisLabel = 'search.filters.applied.charts.<facet name>.y_label';

  /**
   * Part of i18n key pattern that will be replaced
   * @private
   * @memberof SearchChartFilterComponent
   */
  private keyPlaceholder = '<facet name>';

  /**
   * Used to check if a chart is reversed or not
   *
   * @memberof SearchChartFilterComponent
   */
  isReverseChart = false;

  ngOnInit() {
    super.ngOnInit();
    this.results = this.getInitData();
  }

  /**
   * Navigate to route containing selected filter values
   * @param data
   */
  select(data) {
    const decoded = decodeURI(data.extra._links.search.href);
    const links = decoded.split('?');
    if (links && links.length > 1) {
      const queryParam: any = {};
      links[1].split('&').forEach(res => {
        const str = res.split('=');
        if (queryParam[str[0]] && queryParam[str[0]].includes(str[1])) {
          // if the value is already selected, then return
          // do not add the same value again
          return;
        }
        queryParam[str[0]] = queryParam[str[0]] ? [...queryParam[str[0]], str[1]] : [str[1]];
      });

      if (this.currentUrl) {
        const currentQueryParams = (this.currentUrl.split('?')[1] || '').split('&');
        const pageParam = currentQueryParams.filter((param) => param.includes('page'));
        if (pageParam.length > 0) {
          const paramName = pageParam[0].split('=')[0];
          queryParam[paramName] = [1];
        }
      } else {
        queryParam['spc.page'] = [1];
      }

      this.router.navigate(this.getSearchLinkParts(), {
        queryParams: queryParam,
        queryParamsHandling: 'merge',
      });
    }
  }

  protected getInitData(): Observable<ChartSeries[] | ChartData[]> {
    return this.filterValues$.pipe(
      getAllCompletedRemoteData(),
      map((facetValues: RemoteData<PaginatedList<FacetValue>[]>) => {
        const values = [];
        facetValues.payload.forEach((facetValue: FacetValues) => {
          this.xAxisLabel = this.xAxisLabel.replace(this.keyPlaceholder, facetValue.name);
          this.yAxisLabel = this.yAxisLabel.replace(this.keyPlaceholder, facetValue.name);
          if (this.isReverseChart) {
            values.push(
              ...facetValue.page.map(
                (item: FacetValue) =>
                ({
                  name: item.count.toString(),
                  value: Number(item.value),
                  extra: item,
                } as ChartSeries)
              )
            );
          } else {
            values.push(
              ...facetValue.page.map(
                (item: FacetValue) =>
                  ({
                    name: item.value,
                    value: item.count,
                    extra: item,
                  } as ChartSeries)
              )
            );
          }
        });

        return values;
      }),
    );
  }
}
