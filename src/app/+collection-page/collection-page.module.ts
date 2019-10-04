import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { CollectionPageComponent } from './collection-page.component';
import { CollectionPageRoutingModule } from './collection-page-routing.module';
import { CreateCollectionPageComponent } from './create-collection-page/create-collection-page.component';
import { CollectionFormComponent } from './collection-form/collection-form.component';
import { DeleteCollectionPageComponent } from './delete-collection-page/delete-collection-page.component';
import { SearchService } from '../+search-page/search-service/search.service';
import { EditItemTemplatePageComponent } from './edit-item-template-page/edit-item-template-page.component';
import { EditItemPageModule } from '../+item-page/edit-item-page/edit-item-page.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EditItemPageModule,
    CollectionPageRoutingModule
  ],
  declarations: [
    CollectionPageComponent,
    CreateCollectionPageComponent,
    DeleteCollectionPageComponent,
    CollectionFormComponent,
    EditItemTemplatePageComponent
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
