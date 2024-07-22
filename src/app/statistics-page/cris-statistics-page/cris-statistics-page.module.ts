import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { SharedModule } from '../../shared/shared.module';
import { CrisStatisticsPageComponent } from './cris-statistics-page.component';
import { StatisticsChartModule } from './statistics-chart/statistics-chart.module';
import { StatisticsMapComponent } from './statistics-map/statistics-map.component';
import { StatisticsPipesPageModule } from './statistics-pipes/statistics-pipes.module';

const components = [
  CrisStatisticsPageComponent,
  StatisticsMapComponent,
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    StatisticsChartModule.withEntryComponents(),
    HttpClientJsonpModule,
    SharedModule.withEntryComponents(),
    StatisticsPipesPageModule,
    Ng2GoogleChartsModule,
  ],
  exports : components,
  // entryComponents:[CrisStatisticsPageComponent]
})
export class CrisStatisticsPageModule { }
