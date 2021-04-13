import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsChartComponent } from './statistics-chart.component';
import { StatisticsChartWrapperComponent } from './statistics-chart-wrapper/statistics-chart-wrapper.component';
import { StatisticsChartPieComponent } from './statistics-chart-pie/statistics-chart-pie.component';
import { StatisticsChartLineComponent } from './statistics-chart-line/statistics-chart-line.component';
import { StatisticsChartBarComponent } from './statistics-chart-bar/statistics-chart-bar.component';
import { SharedModule } from '../../../shared/shared.module';
import { DataReportService } from '../../../core/statistics/data-report.service';
import { StatisticsPipesPageModule } from '../statistics-pipes/statistics-pipes.module';
import { StatisticsTableComponent } from './statistics-table/statistics-table.component';
import { ExportService } from '../../../core/export-service/export.service';

import { ExportAsModule } from 'ngx-export-as';
import { StatisticsChartDataComponent } from './statistics-chart-data/statistics-chart-data.component';

const components = [
  StatisticsChartComponent,
  StatisticsChartDataComponent,
  StatisticsChartWrapperComponent,
  StatisticsChartPieComponent,
  StatisticsChartLineComponent,
  StatisticsChartBarComponent,
  StatisticsTableComponent,
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    SharedModule.withEntryComponents(),
    StatisticsPipesPageModule,
    ExportAsModule
  ],
  exports : components,
  schemas:[NO_ERRORS_SCHEMA],
  providers: [DataReportService,ExportService]
  // entryComponents:[CrisStatisticsPageComponent]
})
export class StatisticsChartModule { }
