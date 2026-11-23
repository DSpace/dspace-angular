import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { PieChartModule } from '@swimlane/ngx-charts';

import { fadeIn } from '../../../shared/animations/fade';
import { renderChartTypeFor } from '../../charts.decorator';
import { ChartType } from '../../models/chart-type';
import { AbstractChartComponent } from '../abstract-chart/abstract-chart.component';

@renderChartTypeFor(ChartType.PIE)
@Component({
  selector: 'ds-pie-chart',
  styleUrls: ['./pie-chart.component.scss'],
  templateUrl: './pie-chart.component.html',
  animations: [fadeIn],
  imports: [
    AsyncPipe,
    PieChartModule,
  ],
})
export class PieChartComponent extends AbstractChartComponent {
  /**
   * flag to show/hide Labels on  Chart.
   */
  showLabels = true;
}
