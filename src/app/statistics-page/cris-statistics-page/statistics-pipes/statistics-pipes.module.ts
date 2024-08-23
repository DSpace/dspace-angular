import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CreateLinkPipe } from './create-link.pipe';
import { FilterMapPipe } from './filter-map.pipe';

const pipes = [FilterMapPipe, CreateLinkPipe];

@NgModule({
  imports: [CommonModule, ...pipes],
  exports: pipes,
})
export class StatisticsPipesPageModule { }
