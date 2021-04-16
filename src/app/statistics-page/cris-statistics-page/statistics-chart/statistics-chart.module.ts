import { NgModule, NO_ERRORS_SCHEMA, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

import { StatisticsChartComponent } from './statistics-chart.component';
import { StatisticsChartWrapperComponent } from './statistics-chart-wrapper/statistics-chart-wrapper.component';
import { StatisticsChartPieComponent } from './statistics-chart-pie/statistics-chart-pie.component';
import { StatisticsChartLineComponent } from './statistics-chart-line/statistics-chart-line.component';
import { StatisticsChartBarComponent } from './statistics-chart-bar/statistics-chart-bar.component';
import { SharedModule } from '../../../shared/shared.module';
import { DataReportService } from '../../../core/statistics/data-report.service';
import { StatisticsPipesPageModule } from '../statistics-pipes/statistics-pipes.module';
import { StatisticsTableComponent } from './statistics-table/statistics-table.component';
import { StatisticsChartDataComponent } from './statistics-chart-data/statistics-chart-data.component';
import { ExportService } from '../../../core/export-service/export.service';
import { ServerExportService } from '../../../core/export-service/server-export.service';

const ENTRY_COMPONENTS = [
  StatisticsChartPieComponent,
  StatisticsChartLineComponent,
  StatisticsChartBarComponent,
  StatisticsTableComponent
];

const imports = [
  CommonModule,
  SharedModule.withEntryComponents(),
  StatisticsPipesPageModule,
];
const components = [
  StatisticsChartComponent,
  StatisticsChartDataComponent,
  StatisticsChartWrapperComponent,
  StatisticsChartPieComponent,
  StatisticsChartLineComponent,
  StatisticsChartBarComponent,
  StatisticsTableComponent
];
const providers: Provider[] = [
  DataReportService
];

// Due to a dependency of ExportAsModule which use window object, the module is imported dynamically only on CSR
if (isPlatformBrowser) {
  const ExportAsModule = require('ngx-export-as').ExportAsModule;
  imports.push(ExportAsModule);
  providers.push({ provide: ExportService, useClass: ExportService});
} else {
  providers.push({ provide: ExportService, useClass: ServerExportService});
}
@NgModule({
  declarations: components,
  imports: [
    ...imports
  ],
  exports : components,
  schemas:[NO_ERRORS_SCHEMA],
  providers: [
    ...providers
  ]
})
export class StatisticsChartModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during CSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: StatisticsChartModule,
      providers: ENTRY_COMPONENTS.map((component) => ({provide: component}))
    };
  }
}
