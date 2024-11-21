import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ChartComponent } from '../../../../../charts/components/chart/chart.component';
import { facetLoad } from '../../../search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { SearchChartFilterComponent } from '../search-chart-filter/search-chart-filter.component';

@Component({
  selector: 'ds-search-chart-bar-to-right',
  styleUrls: ['./search-chart-bar-to-right.component.scss'],
  templateUrl: './search-chart-bar-to-right.component.html',
  animations: [facetLoad],
  imports: [
    ChartComponent,
    NgIf,
    AsyncPipe,
    TranslateModule,
  ],
  standalone: true,
})
/**
 * Component that represents a search bar-to-right chart filter
 */
export class SearchChartBarToRightComponent extends SearchChartFilterComponent implements OnInit {

}
