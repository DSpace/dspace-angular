import { Component, OnInit } from '@angular/core';

import { StatisticsType } from '../../statistics-type.model';
import { renderChartFor } from '../../cris-statistics-element-decorator';
import { StatisticsChartDataComponent } from '../statistics-chart-data/statistics-chart-data.component';
import { Observable,of } from 'rxjs';

@Component({
  selector: 'ds-statistics-table',
  templateUrl: './statistics-table.component.html',
  styleUrls: ['./statistics-table.component.scss']
})

/**
 * Component that represents a table for report
 */
/* tslint:disable:no-string-literal */
@renderChartFor(StatisticsType['table'])
/* tslint:enable:no-string-literal */
export class StatisticsTableComponent extends StatisticsChartDataComponent implements OnInit {


  /**
   * Boolean indicating whether the usage report has data
   */
  hasData: boolean;

  /**
   * The table headers
   */
  headers: string[];


  /**
   * Check if report has information and if data is present to show in the view
   * Insert table headers
   */
  ngOnInit() {
    if ( !!this.report && this.report.points.length > 0 ) {
      this.hasData = true;
    } else {
      this.hasData = false;
    }
    if (this.hasData) {
      this.headers = [ this.report.points[0].type ,Object.keys(this.report.points[0].values)[0] ];
    }
  }


  /**
   * Get the row label to display for a statistics point.
   * @param point the statistics point to get the label for
   */
  // getLabel(point: Point): Observable<string> {
    // switch (this.report.reportType) {
    //   case 'TotalVisits':
    //     return this.dsoService.findById(point.id).pipe(
    //       getFirstSucceededRemoteData(),
    //       getRemoteDataPayload(),
    //       map((item) => this.nameService.getName(item)),
    //     );
    //   case 'TopCities':
    //   case 'topCountries':
    //   default:
        // return of(point.label);
    // }
  // }

}
