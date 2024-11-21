import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import {
  filter,
  map,
} from 'rxjs/operators';

import { ChartComponent } from '../../../../../charts/components/chart/chart.component';
import { ChartData } from '../../../../../charts/models/chart-data';
import { ChartSeries } from '../../../../../charts/models/chart-series';
import { RemoteDataBuildService } from '../../../../../core/cache/builders/remote-data-build.service';
import { SearchService } from '../../../../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../../../../core/shared/search/search-configuration.service';
import {
  FILTER_CONFIG,
  IN_PLACE_SEARCH,
  REFRESH_FILTER,
  SCOPE,
  SearchFilterService,
} from '../../../../../core/shared/search/search-filter.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../../my-dspace-page/my-dspace-configuration.service';
import { isNotEmpty } from '../../../../empty.util';
import { FacetValue } from '../../../models/facet-value.model';
import { FacetValues } from '../../../models/facet-values.model';
import { SearchFilterConfig } from '../../../models/search-filter-config.model';
import { facetLoad } from '../../../search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { SearchChartFilterComponent } from '../search-chart-filter/search-chart-filter.component';

@Component({
  selector: 'ds-search-chart-pie',
  styleUrls: ['./search-chart-pie.component.scss'],
  templateUrl: './search-chart-pie.component.html',
  animations: [facetLoad],
  imports: [
    AsyncPipe,
    TranslateModule,
    NgIf,
    ChartComponent,
  ],
  standalone: true,
})
/**
 * Component that represents a search pie chart filter
 */
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
    super(searchService, filterService, rdbs, router, searchConfigService);
  }

  protected getInitData(): Observable<ChartSeries[] | ChartData[]> {
    return this.facetValues$.pipe(
      filter((facetValues: FacetValues[]) => isNotEmpty(facetValues)),
      map((facetValues: FacetValues[]) => {
        const values = [];
        facetValues.forEach((facetValue: FacetValues) => {
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
              search: facetValue._links.more,
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
