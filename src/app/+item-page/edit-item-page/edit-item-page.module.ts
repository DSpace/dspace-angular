import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { EditItemPageRoutingModule } from './edit-item-page.routing.module';
import { EditItemPageComponent } from './edit-item-page.component';
import { ItemStatusComponent } from './item-status/item-status.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EditItemPageRoutingModule
  ],
  declarations: [
    EditItemPageComponent,
    ItemStatusComponent
  ]
})
export class EditItemPageModule {

}
