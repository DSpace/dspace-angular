import { Component } from '@angular/core';
import { fadeIn } from '../../../shared/animations/fade';
import { ChartType } from '../../../shared/enums/chart-type';
import { renderChartFor } from '../../charts.decorator';
import { AbstractChartComponent } from '../abstract-chart/abstract-chart.component';

@Component({
  selector: 'ds-bar-chart',
  styleUrls: ['./bar-chart.component.scss'],
  templateUrl: './bar-chart.component.html',
  animations: [fadeIn],
})
@renderChartFor(ChartType.BAR)
export class BarChartComponent extends AbstractChartComponent {

  /**
   * flag to show/hide xAxis Line.
   */
  xAxis = true;

  /**
   * flag to show/hide yAxis Line.
   */
  yAxis = true;
}
