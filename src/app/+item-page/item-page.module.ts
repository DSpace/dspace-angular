import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { ItemPageComponent } from './simple/item-page.component';
import { ItemPageRoutingModule } from './item-page-routing.module';
import { FullItemPageComponent } from './full/full-item-page.component';
import { FullFileSectionComponent } from './full/field-components/file-section/full-file-section.component';
import { EditItemPageModule } from './edit-item-page/edit-item-page.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EditItemPageModule,
    ItemPageRoutingModule
  ],
  declarations: [
    ItemPageComponent,
    FullItemPageComponent,
    FullFileSectionComponent
  ]
})
export class ItemPageModule {

}
