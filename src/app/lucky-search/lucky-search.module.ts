import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SearchModule } from '../shared/search/search.module';
import { SharedModule } from '../shared/shared.module';
import { LuckySearchRoutingModule } from './lucky-search-routing.module';
import { LuckySearchComponent } from './search/lucky-search.component';


@NgModule({
  declarations: [LuckySearchComponent],
  imports: [
    CommonModule,
    SharedModule.withEntryComponents(),
    SearchModule.withEntryComponents(),
    LuckySearchRoutingModule,
  ],
})
export class LuckySearchModule { }
