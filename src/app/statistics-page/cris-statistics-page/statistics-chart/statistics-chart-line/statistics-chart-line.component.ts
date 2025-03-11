import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';

import { ChartComponent } from '../../../../charts/components/chart/chart.component';
import { ChartData } from '../../../../charts/models/chart-data';
import { ChartSeries } from '../../../../charts/models/chart-series';
import { REPORT_DATA } from '../../../../core/statistics/data-report.service';
import {
  Point,
  UsageReport,
} from '../../../../core/statistics/models/usage-report.model';
import { AlertComponent } from '../../../../shared/alert/alert.component';
import { StatisticsChartDataComponent } from '../statistics-chart-data/statistics-chart-data.component';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
@Component({
  selector: 'ds-statistics-chart-line',
  styleUrls: ['./statistics-chart-line.component.scss'],
  templateUrl: './statistics-chart-line.component.html',
  standalone: true,
  imports: [
    NgIf,
    ChartComponent,
    AlertComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
/**
 * Component that represents a line chart
 */
export class StatisticsChartLineComponent extends StatisticsChartDataComponent {

  constructor(
    @Inject(REPORT_DATA) public report: UsageReport,
    @Inject('categoryType') public categoryType: string,
    @Inject(PLATFORM_ID) protected platformId: any,
  ) {
    super(report, categoryType, platformId);
  }

  /**
   * Parse information as needed by line chart overriding function
   */
  public getInitData(): Observable<ChartSeries[] | ChartData[]> {

    let key = 'views';

    if (this.report.points[0]) {
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
          series: series,
        },
      ],
    );
  }

}
