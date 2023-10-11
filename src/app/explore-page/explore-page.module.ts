import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ExploreRoutingModule } from './explore-routing.module';
import { ExplorePageComponent } from './explore-page.component';
import { ExploreModule } from '../shared/explore/explore.module';

@NgModule({
  imports: [
    ExploreRoutingModule,
    CommonModule,
    SharedModule,
    ExploreModule
  ],
  declarations: [
    ExplorePageComponent,
  ],
  providers: [],
  entryComponents: [
    ExplorePageComponent
  ]
})
export class ExplorePageModule {

}
