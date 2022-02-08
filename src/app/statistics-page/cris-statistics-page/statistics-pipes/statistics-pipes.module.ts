import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterMapPipe } from './filter-map.pipe';
import { CreateLinkPipe } from './create-link.pipe';

const pipes = [FilterMapPipe, CreateLinkPipe];

@NgModule({
  declarations: pipes,
  imports: [CommonModule],
  exports: pipes,
  // entryComponents:[CrisStatisticsPageComponent]
})
export class StatisticsPipesPageModule { }
