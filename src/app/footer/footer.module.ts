import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ExploreModule } from '../shared/explore/explore.module';
import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './footer.component';
import { ThemedFooterComponent } from './themed-footer.component';

const COMPONENTS = [
  FooterComponent,
  ThemedFooterComponent,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    CommonModule,
    ExploreModule,
    SharedModule,
  ],
  exports: [
    ...COMPONENTS,
  ],
})
export class FooterModule { }
