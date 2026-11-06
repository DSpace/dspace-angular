import { AsyncPipe } from '@angular/common';
import {
  Component,
  Inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { RemoteDataBuildService } from '@dspace/core/cache/builders/remote-data-build.service';
import { FacetValues } from '@dspace/core/shared/search/models/facet-values.model';
import { isNotEmpty } from '@dspace/shared/utils/empty.util';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  filter,
  map,
} from 'rxjs/operators';

import { ChartComponent } from '../../../../../charts/components/chart/chart.component';
import { ChartData } from '../../../../../charts/models/chart-data';
import { SEARCH_CONFIG_SERVICE } from '../../../../../my-dspace-page/my-dspace-configuration.service';
import { SearchService } from '../../../search.service';
import { SearchConfigurationService } from '../../../search-configuration.service';
import { SearchFilterService } from '../../../search-filters/search-filter.service';
import { facetLoad } from '../../../search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { renderChartFilterFor } from '../../chart-search-result-element-decorator';
import { SearchChartFilterComponent } from '../search-chart-filter/search-chart-filter.component';

@renderChartFilterFor('chart.line')
@Component({
  selector: 'ds-search-chart-line',
  styleUrls: ['./search-chart-line.component.scss'],
  templateUrl: './search-chart-line.component.html',
  animations: [facetLoad],
  imports: [
    AsyncPipe,
    ChartComponent,
    TranslateModule,
  ],
})
/**
 * Component that represents a search line chart filter
 */
export class SearchChartLineComponent extends SearchChartFilterComponent {

  constructor(
    protected searchService: SearchService,
    protected filterService: SearchFilterService,
    protected rdbs: RemoteDataBuildService,
    protected router: Router,
    protected translate: TranslateService,
    @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
  ) {
    super(searchService, filterService, rdbs, router, searchConfigService);
  }

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
