import { Component } from '@angular/core';

import { fadeIn } from '../../../shared/animations/fade';
import { renderChartFor } from '../../charts.decorator';
import { ChartType } from '../../models/chart-type';
import { AbstractChartComponent } from '../abstract-chart/abstract-chart.component';
import { AsyncPipe } from '@angular/common';
import { PieChartModule } from '@swimlane/ngx-charts';

@Component({
    selector: 'ds-pie-chart',
    styleUrls: ['./pie-chart.component.scss'],
    templateUrl: './pie-chart.component.html',
    animations: [fadeIn],
    standalone: true,
    imports: [PieChartModule, AsyncPipe],
})
@renderChartFor(ChartType.PIE)
export class PieChartComponent extends AbstractChartComponent {
  /**
   * flag to show/hide Labels on  Chart.
   */
  showLabels = true;
}
