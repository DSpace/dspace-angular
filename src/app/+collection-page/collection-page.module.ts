import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { CollectionPageComponent } from './collection-page.component';
import { CollectionPageRoutingModule } from './collection-page-routing.module';
import { CreateCollectionPageComponent } from './create-collection-page/create-collection-page.component';
import { CollectionFormComponent } from './collection-form/collection-form.component';
import { DeleteCollectionPageComponent } from './delete-collection-page/delete-collection-page.component';
import { SearchService } from '../+search-page/search-service/search.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CollectionPageRoutingModule
  ],
  declarations: [
    CollectionPageComponent,
    CreateCollectionPageComponent,
    DeleteCollectionPageComponent,
    CollectionFormComponent
  ],
  exports: [
    CollectionFormComponent
  ],
  providers: [
    SearchService
  ]
})
export class CollectionPageModule {

}
