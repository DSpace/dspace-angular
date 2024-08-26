import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LuckySearchRoutingModule } from './lucky-search-routing.module';
import { LuckySearchComponent } from './search/lucky-search.component';


@NgModule({
  declarations: [LuckySearchComponent],
  imports: [
    CommonModule,
    LuckySearchRoutingModule,
  ],
})
export class LuckySearchModule { }
