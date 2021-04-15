import { Component, Input, OnInit } from '@angular/core';
import { UsageReport } from '../../../core/statistics/models/usage-report.model';
import { StatisticsCategory } from '../../../core/statistics/models/statistics-category.model';

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

  /**
   * Requests the current set values for this chart
   * If the chart config is open by default OR the chart has at least one value, the chart should be initially expanded
   * Else, the chart should initially be collapsed
   */
  ngOnInit() {
    if (!!this.reports && this.reports.length > 0) {
      this.selectedReport = this.reports[0];
    }
    // this.dataReportService.setReport(this.selectedReport);
  }

  /**
   * When tab changed , insert new report type.
   * @param report the that is being selected
   */
  changeReport(report) {
    this.selectedReport = report;
    // this.dataReportService.setReport(report);
  }


}
