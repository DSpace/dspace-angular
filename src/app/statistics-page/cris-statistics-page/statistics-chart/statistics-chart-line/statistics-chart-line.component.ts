import { Component } from '@angular/core';

import { StatisticsType } from '../../statistics-type.model';
import { renderChartFor } from '../../cris-statistics-element-decorator';
import { StatisticsChartDataComponent } from '../statistics-chart-data/statistics-chart-data.component';

import { Observable, of } from 'rxjs';
import { ChartData } from '../../../../charts/models/chart-data';
import { ChartSeries } from '../../../../charts/models/chart-series';

import { Point } from '../../../../core/statistics/models/usage-report.model';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-statistics-chart-line',
  styleUrls: ['./statistics-chart-line.component.scss'],
  templateUrl: './statistics-chart-line.component.html',
})
/**
 * Component that represents a line chart
 */
@renderChartFor(StatisticsType['chart.line'])
export class StatisticsChartLineComponent extends StatisticsChartDataComponent {
  /**
   * Parse information as needed by line chart overriding function
   */
  public getInitData(): Observable<ChartSeries[] | ChartData[]> {

    let key = 'views';

    if (!!this.report.points[0]) {
      key = Object.keys(this.report.points[0].values)[0];
    }

    const series = this.report.points.map(
      (point: Point) => {
        return {
          name: point.label,
          value: point.values[key],
          extra: point,
        };
      });

    return of(
      [
        {
          name: this.report.reportType,
          series: series
        }
      ]
    );
  }

}
