import { Component, Input, OnInit } from '@angular/core';
import { Point, UsageReport } from '../../core/statistics/models/usage-report.model';
import { Observable, of } from 'rxjs';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { map } from 'rxjs/operators';
import { getRemoteDataPayload, getFinishedRemoteData } from '../../core/shared/operators';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { isEmpty } from '../../shared/empty.util';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

/**
 * Component representing a statistics table for a given usage report.
 */
@Component({
    selector: 'ds-statistics-table',
    templateUrl: './statistics-table.component.html',
    styleUrls: ['./statistics-table.component.scss'],
    standalone: true,
    imports: [NgIf, NgFor, AsyncPipe, TranslateModule]
})
export class StatisticsTableComponent implements OnInit {

  /**
   * The usage report to display a statistics table for
   */
  @Input()
  report: UsageReport;

  /**
   * Boolean indicating whether the usage report has data
   */
  hasData: boolean;

  /**
   * The table headers
   */
  headers: string[];

  constructor(
    protected dsoService: DSpaceObjectDataService,
    protected nameService: DSONameService,
    private translateService: TranslateService,
  ) {

  }

  ngOnInit() {
    this.hasData = this.report.points.length > 0;
    if (this.hasData) {
      this.headers = Object.keys(this.report.points[0].values);
    }
  }

  /**
   * Get the row label to display for a statistics point.
   * @param point the statistics point to get the label for
   */
  getLabel(point: Point): Observable<string> {
    switch (this.report.reportType) {
      case 'TotalVisits':
        return this.dsoService.findById(point.id).pipe(
          getFinishedRemoteData(),
          getRemoteDataPayload(),
          map((item) => !isEmpty(item) ?  this.nameService.getName(item) : this.translateService.instant('statistics.table.no-name')),
        );
      case 'TopCities':
      case 'topCountries':
      default:
        return of(point.label);
    }
  }
}
