import {
  AsyncPipe,
  Location,
  NgClass,
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
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';

import { StatisticsCategory } from '../../../core/statistics/models/statistics-category.model';
import { UsageReport } from '../../../core/statistics/models/usage-report.model';
import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import { FilterMapPipe } from '../statistics-pipes/filter-map.pipe';
import { StatisticsChartWrapperComponent } from './statistics-chart-wrapper/statistics-chart-wrapper.component';

@Component({
  selector: 'ds-statistics-chart',
  styleUrls: ['./statistics-chart.component.scss'],
  templateUrl: './statistics-chart.component.html',
  imports: [
    AsyncPipe,
    FilterMapPipe,
    NgClass,
    StatisticsChartWrapperComponent,
    ThemedLoadingComponent,
    TranslateModule,
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
   * The fully loaded report (with points) for the currently selected report.
   */
  @Input() selectedFullReport: Observable<UsageReport>;

  /**
   * Emits all currently selected values for this chart
   */
  selectedReport$: BehaviorSubject<UsageReport> = new BehaviorSubject<UsageReport>(null);

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
        this.selectedReport$.next(report);
      } else {
        this.selectedReport$.next(this.reports[0]);
        this.changeReportEvent.emit(this.reports[0].id);
      }
      this.addQueryParams(this.selectedReport$.value.reportType);
    }
  }

  /**
   * When tab changed , insert new report type.
   * @param report the that is being selected
   */
  changeReport(report) {
    this.selectedReport$.next(report);
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
