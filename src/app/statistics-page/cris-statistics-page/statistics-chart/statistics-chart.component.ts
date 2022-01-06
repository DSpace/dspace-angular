import { Component, Input, OnInit } from '@angular/core';
import { UsageReport } from '../../../core/statistics/models/usage-report.model';
import { StatisticsCategory } from '../../../core/statistics/models/statistics-category.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserReportState } from 'src/app/core/statistics/statistics.reducer';
import { SetReportAction } from 'src/app/core/statistics/statistics.action';

@Component({
  selector: 'ds-statistics-chart',
  styleUrls: ['./statistics-chart.component.scss'],
  templateUrl: './statistics-chart.component.html',
  // animations: [slide],
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
   * Represents list of reports for the selected category
   */
  @Input() reports: UsageReport[];

  /**
   * Emits all currently selected values for this chart
   */
  selectedReport: UsageReport;

  constructor(private store: Store<{statistics: UserReportState}>) {}

  /**
   * Requests the current set values for this chart
   * If the chart config is open by default OR the chart has at least one value, the chart should be initially expanded
   * Else, the chart should initially be collapsed
   */
  ngOnInit() {
   this.setReport();
  }

  /**
   * When tab changed , insert new report type.
   * @param report the that is being selected
   */
  changeReport(report) {
    this.selectedReport = report;
    this.store.dispatch(new SetReportAction({reportId: report.id}));
  }

  /**
   * set the default report in case if no report is present otherwise it's set previous report
   */
  setReport() {
    const report$: Observable<UserReportState> = this.store.select(state => state.statistics);
    report$.subscribe((data: UserReportState ) => {
        if (!!this.reports && this.reports.length > 0) {
          if (!data.reportId) {
            this.selectedReport = this.reports[0];
            this.store.dispatch(new SetReportAction({reportId:this.reports[0].id}));
          } else {
            this.selectedReport = this.reports.find(report => report.id === data.reportId);
            if (!this.selectedReport) {
              this.selectedReport = this.reports[0];
              this.store.dispatch(new SetReportAction({reportId:this.reports[0].id}));
          }
        }
      }
    });
  }
}
