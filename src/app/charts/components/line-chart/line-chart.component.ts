import { Component } from '@angular/core';
import { fadeIn } from '../../../shared/animations/fade';
import { ChartType } from '../../models/chart-type';
import { renderChartFor } from '../../charts.decorator';
import { AbstractChartComponent } from '../abstract-chart/abstract-chart.component';

@Component({
  selector: 'ds-line-chart',
  styleUrls: ['./line-chart.component.scss'],
  templateUrl: './line-chart.component.html',
  animations: [fadeIn],
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
