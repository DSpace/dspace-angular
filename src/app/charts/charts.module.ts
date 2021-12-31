import { NgModule } from '@angular/core';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TranslateModule } from '@ngx-translate/core';

import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { ChartComponent } from './components/chart/chart.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';


const MODULES = [
  NgxChartsModule,
  TranslateModule
];

const COMPONENTS = [
  ChartComponent,
  LineChartComponent,
  PieChartComponent,
  BarChartComponent
];

const ENTRY_COMPONENTS = [
  LineChartComponent,
  PieChartComponent,
  BarChartComponent,
];

@NgModule({
  imports: [
    ...MODULES
  ],
  declarations: [
    ...COMPONENTS
  ],
  exports: [
    ...COMPONENTS
  ]
})

/**
 * This module handles all components that are necessary for the Chart components
 */
export class ChartsModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during CSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: ChartsModule,
      providers: ENTRY_COMPONENTS.map((component) => ({provide: component}))
    };
  }
}
