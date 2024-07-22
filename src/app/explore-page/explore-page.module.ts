import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ExploreModule } from '../shared/explore/explore.module';
import { SharedModule } from '../shared/shared.module';
import { ExplorePageComponent } from './explore-page.component';
import { ExploreRoutingModule } from './explore-routing.module';

@NgModule({
  imports: [
    ExploreRoutingModule,
    CommonModule,
    SharedModule,
    ExploreModule,
  ],
  declarations: [
    ExplorePageComponent,
  ],
  providers: [],
  entryComponents: [
    ExplorePageComponent,
  ],
})
export class ExplorePageModule {

}
