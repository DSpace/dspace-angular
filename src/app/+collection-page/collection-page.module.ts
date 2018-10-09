import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { CollectionPageComponent } from './collection-page.component';
import { CollectionPageRoutingModule } from './collection-page-routing.module';
import { SearchPageModule } from '../+search-page/search-page.module';
import { CollectionItemMapperComponent } from './collection-item-mapper/collection-item-mapper.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SearchPageModule,
    CollectionPageRoutingModule
  ],
  declarations: [
    CollectionPageComponent,
    CollectionItemMapperComponent
  ]
})
export class CollectionPageModule {

}
