import { Component} from '@angular/core';
import { fadeIn } from 'src/app/shared/animations/fade';
import { ChartType } from '../../../shared/enums/chart-type';
import { renderChartFor } from '../../charts.decorator';
import { AbstractChartComponent } from '../abstract-chart/abstract-chart.component';

@Component({
  selector: 'ds-pie-chart',
  styleUrls: ['./pie-chart.component.scss'],
  templateUrl: './pie-chart.component.html',
  animations: [fadeIn]
})
@renderChartFor(ChartType.PIE)
export class PieChartComponent extends AbstractChartComponent {

  /**
   * flag to show/hide Labels on  Chart.
   */
  showLabels = true;

}
