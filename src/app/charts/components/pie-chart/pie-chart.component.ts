import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { PieChartModule } from '@swimlane/ngx-charts';

import { fadeIn } from '../../../shared/animations/fade';
import { AbstractChartComponent } from '../abstract-chart/abstract-chart.component';

@Component({
  selector: 'ds-pie-chart',
  styleUrls: ['./pie-chart.component.scss'],
  templateUrl: './pie-chart.component.html',
  animations: [fadeIn],
  standalone: true,
  imports: [PieChartModule, AsyncPipe],
})
export class PieChartComponent extends AbstractChartComponent {
  /**
   * flag to show/hide Labels on  Chart.
   */
  showLabels = true;
}
