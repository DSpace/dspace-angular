import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AbstractChartComponent } from './components/abstract-chart/abstract-chart.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { ChartComponent } from './components/chart/chart.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';

const MODULES = [
  CommonModule,
  NgxChartsModule
];

const COMPONENTS = [
  ChartComponent,
  LineChartComponent,
  PieChartComponent,
  BarChartComponent,
  AbstractChartComponent,
];

const DIRECTIVES = [];

const ENTRY_COMPONENTS = [
  ChartComponent,
  LineChartComponent,
  PieChartComponent,
  BarChartComponent,
];

const PROVIDERS = [
];

@NgModule({
  imports: [
    ...MODULES
  ],
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
    ...ENTRY_COMPONENTS
  ],
  providers: [
    ...PROVIDERS
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS
  ],
  exports: [
    ...COMPONENTS,
    ...DIRECTIVES
  ]
})

/**
 * This module handles all components that are necessary for the Chart components
 */
export class ChartsModule {
}
