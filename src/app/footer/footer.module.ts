import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';
import { ExploreModule } from '../shared/explore/explore.module';
import { SharedModule } from '../shared/shared.module';

const COMPONENTS = [
  FooterComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    ExploreModule,
    SharedModule
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class FooterModule { }
