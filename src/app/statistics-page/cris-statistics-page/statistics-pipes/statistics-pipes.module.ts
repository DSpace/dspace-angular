import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterMapPipe } from './filter-map.pipe';

const pipes = [
  FilterMapPipe,
];

@NgModule({
  declarations: pipes,
  imports: [
    CommonModule,
  ],
  exports : pipes
  // entryComponents:[CrisStatisticsPageComponent]
})
export class StatisticsPipesPageModule { }
