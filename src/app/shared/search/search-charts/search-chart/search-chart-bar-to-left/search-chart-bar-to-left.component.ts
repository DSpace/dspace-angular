import { AsyncPipe } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { RemoteDataBuildService } from '@dspace/core/cache/builders/remote-data-build.service';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { ChartComponent } from '../../../../../charts/components/chart/chart.component';
import { SEARCH_CONFIG_SERVICE } from '../../../../../my-dspace-page/my-dspace-configuration.service';
import { SearchService } from '../../../search.service';
import { SearchConfigurationService } from '../../../search-configuration.service';
import { SearchFilterService } from '../../../search-filters/search-filter.service';
import { facetLoad } from '../../../search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { renderChartFilterFor } from '../../chart-search-result-element-decorator';
import { SearchChartFilterComponent } from '../search-chart-filter/search-chart-filter.component';

@renderChartFilterFor('chart.bar.right-to-left')
@Component({
  selector: 'ds-search-chart-bar-to-left',
  styleUrls: ['./search-chart-bar-to-left.component.scss'],
  templateUrl: './search-chart-bar-to-left.component.html',
  animations: [facetLoad],
  imports: [
    AsyncPipe,
    ChartComponent,
    TranslateModule,
  ],
})
/**
 * Component that represents a search bar-to-left chart filter
 */
export class SearchChartBarToLeftComponent extends SearchChartFilterComponent implements OnInit {

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

}
