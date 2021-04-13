import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrisStatisticsPageComponent } from './cris-statistics-page.component';
import { StatisticsMapComponent } from './statistics-map/statistics-map.component';
import { SharedModule } from '../../shared/shared.module';
import { StatisticsChartModule } from './statistics-chart/statistics-chart.module';
import { HttpClientJsonpModule } from '@angular/common/http';
import { StatisticsPipesPageModule } from './statistics-pipes/statistics-pipes.module';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

const components = [
  CrisStatisticsPageComponent,
  StatisticsMapComponent,
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    StatisticsChartModule,
    HttpClientJsonpModule,
    SharedModule.withEntryComponents(),
    StatisticsPipesPageModule,
    Ng2GoogleChartsModule
  ],
  exports : components
  // entryComponents:[CrisStatisticsPageComponent]
})
export class CrisStatisticsPageModule { }
