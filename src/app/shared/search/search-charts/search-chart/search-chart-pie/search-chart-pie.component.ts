import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { FilterType } from '../../../models/filter-type.model';
import { facetLoad } from '../../../search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { renderChartFor } from '../../chart-search-result-element-decorator';
import { SearchChartFilterComponent } from '../search-chart-filter/search-chart-filter.component';
import { ChartSeries } from '../../../../../charts/models/chart-series';
import { ChartData } from '../../../../../charts/models/chart-data';
import { RemoteData } from '../../../../../core/data/remote-data';
import { PaginatedList } from '../../../../../core/data/paginated-list.model';
import { FacetValue } from '../../../models/facet-value.model';
import { isNotEmpty } from '../../../../empty.util';
import { FacetValues } from '../../../models/facet-values.model';
import { SearchService } from '../../../../../core/shared/search/search.service';
import {
  FILTER_CONFIG,
  IN_PLACE_SEARCH,
  REFRESH_FILTER,
  SCOPE,
  SearchFilterService
} from '../../../../../core/shared/search/search-filter.service';
import { RemoteDataBuildService } from '../../../../../core/cache/builders/remote-data-build.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../../core/shared/search/search-configuration.service';
import { SearchFilterConfig } from '../../../models/search-filter-config.model';
import { getAllCompletedRemoteData } from '../../../../../core/shared/operators';

@Component({
  selector: 'ds-search-chart-pie',
  styleUrls: ['./search-chart-pie.component.scss'],
  templateUrl: './search-chart-pie.component.html',
  animations: [facetLoad],
})
/**
 * Component that represents a search pie chart filter
 */
@renderChartFor(FilterType['chart.pie'])
export class SearchChartPieComponent extends SearchChartFilterComponent {

  constructor(
      protected searchService: SearchService,
      protected filterService: SearchFilterService,
      protected rdbs: RemoteDataBuildService,
      protected router: Router,
      protected translate: TranslateService,
      @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
      @Inject(IN_PLACE_SEARCH) public inPlaceSearch: boolean,
      @Inject(FILTER_CONFIG) public filterConfig: SearchFilterConfig,
      @Inject(REFRESH_FILTER) public refreshFilters: BehaviorSubject<boolean>,
      @Inject(SCOPE) public scope: string,
  ) {
    super(searchService, filterService, rdbs, router, searchConfigService, inPlaceSearch, filterConfig, refreshFilters, scope);
  }

  protected getInitData(): Observable<ChartSeries[] | ChartData[]> {
    return this.filterValues$.pipe(
      getAllCompletedRemoteData(),
      filter((rd: RemoteData<PaginatedList<FacetValue>[]>) => isNotEmpty(rd.payload)),
      map((facetValues: RemoteData<PaginatedList<FacetValue>[]>) => {
        const values = [];
        facetValues.payload.forEach((facetValue: FacetValues) => {
          const list: any[] = facetValue.page.map((item: FacetValue) => ({
            name: item.value,
            value: item.count,
            extra: item,
          }));

          // search if more results are available and add to filter values
          if (facetValue.more) {
            const moreFacetValue: FacetValue = new FacetValue();
            moreFacetValue.label = this.translate.instant('search.filters.applied.charts.chart.pie.more-value');
            moreFacetValue.value = facetValue.more;
            moreFacetValue._links = {
              self: facetValue._links.more,
              search: facetValue._links.more
            };
            list.push({
              name: moreFacetValue.label,
              value: moreFacetValue.value,
              extra: moreFacetValue,
            });
          }
          values.push(...list);
        });

        return values;
      }),
    );
  }
}
