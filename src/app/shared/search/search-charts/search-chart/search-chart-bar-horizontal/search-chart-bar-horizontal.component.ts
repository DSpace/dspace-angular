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
  selector: 'ds-search-chart-bar-horizontal',
  templateUrl: './search-chart-bar-horizontal.component.html',
  styleUrls: ['./search-chart-bar-horizontal.component.scss'],
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
 * Component that represents a search horizontal/reverse-horizontal bar chart filter
 */
export class SearchChartBarHorizontalComponent extends SearchChartFilterComponent implements OnInit {

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
