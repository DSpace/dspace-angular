import { Component, Inject, PLATFORM_ID } from '@angular/core';

import { Observable, of } from 'rxjs';

import { StatisticsType } from '../../statistics-type.model';
import { renderChartFor } from '../../cris-statistics-element-decorator';
import { StatisticsChartDataComponent } from '../statistics-chart-data/statistics-chart-data.component';
import { ChartData } from '../../../../charts/models/chart-data';
import { ChartSeries } from '../../../../charts/models/chart-series';
import { Point, UsageReport } from '../../../../core/statistics/models/usage-report.model';
import { REPORT_DATA } from '../../../../core/statistics/data-report.service';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
@Component({
  selector: 'ds-statistics-chart-pie',
  styleUrls: ['./statistics-chart-pie.component.scss'],
  templateUrl: './statistics-chart-pie.component.html',
})

/**
 * Component that represents a pie chart
 */
@renderChartFor(StatisticsType['chart.pie'])
export class StatisticsChartPieComponent extends StatisticsChartDataComponent {

  constructor(
    @Inject(REPORT_DATA) public report: UsageReport,
    @Inject('categoryType') public categoryType: string,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {
    super(report, categoryType, platformId);
  }

  /**
   * Parse information as needed by pie chart overriding function
   */
  public getInitData(): Observable<ChartSeries[] | ChartData[]> {
    let key = 'views';
    if (!!this.report.points[0]) {
      key = Object.keys(this.report.points[0].values)[0];
    }

    return of(this.report.points.map(
      (point: Point) => {

        return {
          name: point.label,
          value: point.values[key],
          extra: point
        };
      }
    ));
  }

}
