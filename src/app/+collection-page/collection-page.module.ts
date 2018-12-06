import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CollectionPageRoutingModule } from './collection-page-routing.module';
import { CollectionPageComponent } from './collection-page.component';
import { SharedModule } from '../shared/shared.module';
import { SearchPageModule } from '../+search-page/search-page.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SearchPageModule,
    CollectionPageRoutingModule
  ],
  declarations: [
    CollectionPageComponent,
  ]
})
export class CollectionPageModule {

}
