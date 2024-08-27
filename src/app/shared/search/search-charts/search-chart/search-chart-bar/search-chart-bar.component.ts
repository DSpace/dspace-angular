import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import isEqual from 'lodash/isEqual';

import { ChartComponent } from '../../../../../charts/components/chart/chart.component';
import { FilterType } from '../../../models/filter-type.model';
import { facetLoad } from '../../../search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { SearchChartFilterComponent } from '../search-chart-filter/search-chart-filter.component';

@Component({
  selector: 'ds-search-chart-bar',
  styleUrls: ['./search-chart-bar.component.scss'],
  templateUrl: './search-chart-bar.component.html',
  animations: [facetLoad],
  imports: [
    NgIf,
    AsyncPipe,
    ChartComponent,
    TranslateModule,
  ],
  standalone: true,
})
/**
 * Component that represents a search bar/reverse-bar chart filter
 */
export class SearchChartBarComponent extends SearchChartFilterComponent implements OnInit {

  ngOnInit() {
    super.ngOnInit();
    if (
      isEqual(this.filterConfig.filterType, FilterType['chart.reverse-bar'])
    ) {
      this.isReverseChart = true;
    }
  }
}
