import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { CollectionPageComponent } from './collection-page.component';
import { CollectionPageRoutingModule } from './collection-page-routing.module';
import { CreateCollectionPageComponent } from './create-collection-page/create-collection-page.component';
import { CollectionFormComponent } from './collection-form/collection-form.component';
import { SearchPageModule } from '../+search-page/search-page.module';
import { EditCollectionPageComponent } from './edit-collection-page/edit-collection-page.component';
import { DeleteCollectionPageComponent } from './delete-collection-page/delete-collection-page.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CollectionPageRoutingModule
  ],
  declarations: [
    CollectionPageComponent,
    CreateCollectionPageComponent,
    EditCollectionPageComponent,
    DeleteCollectionPageComponent,
    CollectionFormComponent
  ]
})
export class CollectionPageModule {

}
