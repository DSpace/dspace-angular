import { AsyncPipe } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { RemoteDataBuildService } from '@dspace/core/cache/builders/remote-data-build.service';
import { FilterType } from '@dspace/core/shared/search/models/filter-type.model';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import isEqual from 'lodash/isEqual';

import { ChartComponent } from '../../../../../charts/components/chart/chart.component';
import { SEARCH_CONFIG_SERVICE } from '../../../../../my-dspace-page/my-dspace-configuration.service';
import { SearchService } from '../../../search.service';
import { SearchConfigurationService } from '../../../search-configuration.service';
import { SearchFilterService } from '../../../search-filters/search-filter.service';
import { facetLoad } from '../../../search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { renderChartFilterFor } from '../../chart-search-result-element-decorator';
import { SearchChartFilterComponent } from '../search-chart-filter/search-chart-filter.component';

@renderChartFilterFor('chart.bar.horizontal')
@renderChartFilterFor('chart.reverse-bar.horizontal')
@Component({
  selector: 'ds-search-chart-bar-horizontal',
  templateUrl: './search-chart-bar-horizontal.component.html',
  styleUrls: ['./search-chart-bar-horizontal.component.scss'],
  animations: [facetLoad],
  imports: [
    AsyncPipe,
    ChartComponent,
    TranslateModule,
  ],
})
/**
 * Component that represents a search horizontal/reverse-horizontal bar chart filter
 */
export class SearchChartBarHorizontalComponent extends SearchChartFilterComponent implements OnInit {

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

  ngOnInit() {
    super.ngOnInit();
    if (
      isEqual(
        this.filterConfig.filterType,
        FilterType['chart.reverse-bar.horizontal'],
      )
    ) {
      this.isReverseChart = true;
    }
  }
}
