import { NgModule } from '@angular/core';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { ChartComponent } from './components/chart/chart.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';

const MODULES = [
  NgxChartsModule
];

const COMPONENTS = [
  ChartComponent,
  LineChartComponent,
  PieChartComponent,
  BarChartComponent
];

const ENTRY_COMPONENTS = [
  ChartComponent,
  LineChartComponent,
  PieChartComponent,
  BarChartComponent,
];

@NgModule({
  imports: [
    ...MODULES
  ],
  declarations: [
    ...COMPONENTS,
    ...ENTRY_COMPONENTS
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS
  ],
  exports: [
    ...COMPONENTS
  ]
})

/**
 * This module handles all components that are necessary for the Chart components
 */
export class ChartsModule {
}
