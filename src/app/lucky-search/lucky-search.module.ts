import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LuckySearchComponent } from './search/lucky-search.component';
import { LuckySearchRoutingModule } from './lucky-search-routing.module';
import { SearchModule } from '../shared/search/search.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [LuckySearchComponent],
  imports: [
    CommonModule,
    SharedModule.withEntryComponents(),
    SearchModule.withEntryComponents(),
    LuckySearchRoutingModule
  ]
})
export class LuckySearchModule { }
