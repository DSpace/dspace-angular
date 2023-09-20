import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticsChartComponent } from './statistics-chart.component';
import { StatisticsChartWrapperComponent } from './statistics-chart-wrapper/statistics-chart-wrapper.component';
import { StatisticsChartPieComponent } from './statistics-chart-pie/statistics-chart-pie.component';
import { StatisticsChartLineComponent } from './statistics-chart-line/statistics-chart-line.component';
import { StatisticsChartBarComponent } from './statistics-chart-bar/statistics-chart-bar.component';
import { SharedModule } from '../../../shared/shared.module';
import { StatisticsPipesPageModule } from '../statistics-pipes/statistics-pipes.module';
import { StatisticsTableComponent } from './statistics-table/statistics-table.component';
import { ChartsModule } from '../../../charts/charts.module';

const ENTRY_COMPONENTS = [
  StatisticsChartPieComponent,
  StatisticsChartLineComponent,
  StatisticsChartBarComponent,
  StatisticsTableComponent
];

const IMPORTS = [
  CommonModule,
  SharedModule.withEntryComponents(),
  StatisticsPipesPageModule,
  ChartsModule.withEntryComponents()
];
const COMPONENTS = [
  StatisticsChartComponent,
  StatisticsChartWrapperComponent,
  ...ENTRY_COMPONENTS
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    ...IMPORTS
  ],
  exports : COMPONENTS,
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class StatisticsChartModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during CSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: StatisticsChartModule,
      providers: ENTRY_COMPONENTS.map((component) => ({provide: component})),
    };
  }

}
