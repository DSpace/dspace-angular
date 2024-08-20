import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ExploreModule } from '../shared/explore/explore.module';

@NgModule({
  imports: [
    CommonModule,
    ExploreModule,
  ],
})
export class FooterModule { }
