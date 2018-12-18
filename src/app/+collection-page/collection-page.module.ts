import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { CollectionPageComponent } from './collection-page.component';
import { CollectionPageRoutingModule } from './collection-page-routing.module';
import { SearchService } from '../+search-page/search-service/search.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CollectionPageRoutingModule
  ],
  declarations: [
    CollectionPageComponent,
  ],
  providers: [
    SearchService
  ]
})
export class CollectionPageModule {

}
