import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ExplorePageComponent } from './explore-page.component';
import { ExploreRoutingModule } from './explore-routing.module';

@NgModule({
  imports: [
    ExploreRoutingModule,
    CommonModule,
  ],
  declarations: [
    ExplorePageComponent,
  ],
  providers: [],
})
export class ExplorePageModule {

}
