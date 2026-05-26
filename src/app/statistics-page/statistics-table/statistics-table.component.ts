import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { DSpaceObjectDataService } from '@dspace/core/data/dspace-object-data.service';
import { UsageReport } from '@dspace/core/statistics/models/usage-report.model';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

/**
 * Component representing a statistics table for a given usage report.
 */
@Component({
  selector: 'ds-statistics-table',
  templateUrl: './statistics-table.component.html',
  styleUrls: ['./statistics-table.component.scss'],
  imports: [
    TranslateModule,
  ],
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

  /**
   * Object header label
   */
  objectHeaderLabel: string;

  constructor(
    protected dsoService: DSpaceObjectDataService,
    protected nameService: DSONameService,
    protected translateService: TranslateService,
  ) {

  }

  ngOnInit() {
    this.hasData = this.report.points.length > 0;
    if (this.hasData) {
      this.headers = Object.keys(this.report.points[0].values);
    }
    this.objectHeaderLabel = this.getObjectHeaderLabel(this.report.reportType);
  }

  /**
   * Defines a dynamic label for the object column
   * @param reportType
   */
  getObjectHeaderLabel(reportType: string): string {
    return this.translateService.instant('statistics.table.header.' + reportType);
  }
}
