import { Component } from '@angular/core';

import { fadeIn } from '../../../shared/animations/fade';
import { renderChartFor } from '../../charts.decorator';
import { ChartType } from '../../models/chart-type';
import { AbstractChartComponent } from '../abstract-chart/abstract-chart.component';
import { TranslateModule } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { LineChartModule } from '@swimlane/ngx-charts';

@Component({
    selector: 'ds-line-chart',
    styleUrls: ['./line-chart.component.scss'],
    templateUrl: './line-chart.component.html',
    animations: [fadeIn],
    standalone: true,
    imports: [
        LineChartModule,
        AsyncPipe,
        TranslateModule,
    ],
})
@renderChartFor(ChartType.LINE)
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
