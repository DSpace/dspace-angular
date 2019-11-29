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
import { CollectionItemMapperComponent } from './collection-item-mapper/collection-item-mapper.component';
import { SearchFixedFilterService } from '../+search-page/search-filters/search-filter/search-fixed-filter.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CollectionPageRoutingModule,
    EditItemPageModule
  ],
  declarations: [
    CollectionPageComponent,
    CreateCollectionPageComponent,
    DeleteCollectionPageComponent,
    CollectionFormComponent,
    EditItemTemplatePageComponent,
    CollectionItemMapperComponent
  ],
  exports: [
    CollectionFormComponent
  ],
  providers: [
    SearchService,
    SearchFixedFilterService
  ]
})
export class CollectionPageModule {

}
