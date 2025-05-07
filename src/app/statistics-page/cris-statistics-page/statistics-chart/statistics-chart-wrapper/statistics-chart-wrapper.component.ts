import { NgComponentOutlet } from '@angular/common';
import {
  Component,
  Injector,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import { REPORT_DATA } from '../../../../core/statistics/data-report.service';
import { UsageReport } from '../../../../core/statistics/models/usage-report.model';
import { renderChartStatisticsType } from '../../cris-statistics-element-decorator';
import { StatisticsType } from '../../statistics-type.model';
import { StatisticsChartDataComponent } from '../statistics-chart-data/statistics-chart-data.component';

@Component({
  selector: 'ds-statistics-chart-wrapper',
  templateUrl: './statistics-chart-wrapper.component.html',
  standalone: true,
  imports: [NgComponentOutlet],
})

/**
 * Wrapper component that renders a specific report based on the view type
 */
export class StatisticsChartWrapperComponent implements OnInit, OnChanges {
  /**
   * Type of the statistic of this wrapper component
   */
  @Input() type: StatisticsType;
  /**
   * Report of this wrapper component
   */
  @Input() report: UsageReport;

  /**
   * Category of the statistics
   */
  @Input() categoryType: string;

  /**
   * The constructor of the report that should be rendered, based on the report view-mode type
   */
  chartData: GenericConstructor<StatisticsChartDataComponent>;
  /**
   * Injector to inject a child component with the @Input parameters
   */
  objectInjector: Injector;

  constructor(private injector: Injector) {
  }

  /**
   * Initialize and add the report information to the injector
   */
  ngOnInit(): void {
    this.chartData = this.getStatistics();
    this.objectInjector = Injector.create({
      providers: [
        { provide: REPORT_DATA, useFactory: () => (this.report), deps: [] },
        { provide: 'categoryType', useValue: this.categoryType },
      ],
      parent: this.injector,
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }

  /**
   * Find the correct component based on the filter config's type
   */
  getStatistics() {
    const type: StatisticsType = this.type;
    return renderChartStatisticsType(type);
  }
}
