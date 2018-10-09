import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { EditItemPageRoutingModule } from './edit-item-page.routing.module';
import { SearchPageModule } from '../../+search-page/search-page.module';
import { EditItemPageComponent } from './edit-item-page.component';
import { ItemCollectionMapperComponent } from './item-collection-mapper/item-collection-mapper.component';
import { ItemStatusComponent } from './item-status/item-status.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EditItemPageRoutingModule,
    SearchPageModule
  ],
  declarations: [
    EditItemPageComponent,
    ItemStatusComponent,
    ItemCollectionMapperComponent
  ]
})
export class EditItemPageModule {

}
