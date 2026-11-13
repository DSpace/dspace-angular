import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LineChartModule } from '@swimlane/ngx-charts';

import { fadeIn } from '../../../shared/animations/fade';
import { renderChartTypeFor } from '../../charts.decorator';
import { ChartType } from '../../models/chart-type';
import { AbstractChartComponent } from '../abstract-chart/abstract-chart.component';

@renderChartTypeFor(ChartType.LINE)
@Component({
  selector: 'ds-line-chart',
  styleUrls: ['./line-chart.component.scss'],
  templateUrl: './line-chart.component.html',
  animations: [fadeIn],
  imports: [
    AsyncPipe,
    LineChartModule,
    TranslateModule,
  ],
})
export class LineChartComponent extends AbstractChartComponent {

  /**
   * flag to show/hide xAxis Line.
   */
  xAxis = true;

  /**
   * flag to show/hide yAxis Line.
   */
  yAxis = true;
}
