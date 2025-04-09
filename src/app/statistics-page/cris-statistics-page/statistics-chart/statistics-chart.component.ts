import {
  Location,
  NgClass,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { StatisticsCategory } from '../../../core/statistics/models/statistics-category.model';
import { UsageReport } from '../../../core/statistics/models/usage-report.model';
import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import { FilterMapPipe } from '../statistics-pipes/filter-map.pipe';
import { StatisticsChartWrapperComponent } from './statistics-chart-wrapper/statistics-chart-wrapper.component';

@Component({
  selector: 'ds-statistics-chart',
  styleUrls: ['./statistics-chart.component.scss'],
  templateUrl: './statistics-chart.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    StatisticsChartWrapperComponent,
    FilterMapPipe,
    TranslateModule,
    ThemedLoadingComponent,
    RouterLink,
  ],
})

/**
 * Represents a part of the chart section for a single type of chart
 */
export class StatisticsChartComponent implements OnInit {

  /**
   * Represents selected category
   */
  @Input() category: StatisticsCategory;

  /**
   * Represents selected category type
   */
  @Input() categoryType: string;

  /**
   * Represents list of reports for the selected category
   */
  @Input() reports: UsageReport[];

  /**
   * Represents selected report id
   */
  @Input() selectedReportId: string;

  /**
   * Emits all currently selected values for this chart
   */
  selectedReport: UsageReport;

  /**
   * emit the event when report is changed
   */
  @Output() changeReportEvent = new EventEmitter<string>();

  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  location = inject(Location);

  /**
   * Requests the current set values for this chart
   * If the chart config is open by default OR the chart has at least one value, the chart should be initially expanded
   * Else, the chart should initially be collapsed
   */
  ngOnInit() {
    if (!!this.reports && this.reports.length > 0) {
      const report = this.reports.find((reportData) => { return reportData.id === this.selectedReportId;});
      if (report) {
        this.selectedReport = report;
      } else {
        this.selectedReport = this.reports[0];
        this.changeReportEvent.emit(this.reports[0].id);
      }
      this.addQueryParams(this.selectedReport.reportType);
    }
  }

  /**
   * When tab changed , insert new report type.
   * @param report the that is being selected
   */
  changeReport(report) {
    this.selectedReport = report;
    this.changeReportEvent.emit(report.id);
    this.addQueryParams(report.reportType);
  }

  addQueryParams(reportType: string) {
    this.location.go(this.router.createUrlTree([], {
      queryParams: { reportType },
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
    }).toString());
  }

}
