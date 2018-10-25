import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { EditItemPageRoutingModule } from './edit-item-page.routing.module';
import { EditItemPageComponent } from './edit-item-page.component';
import { ItemStatusComponent } from './item-status/item-status.component';
import {ItemOperationComponent} from './item-operation/item-operation.component';
import {ItemMoveComponent} from './item-move/item-move.component';
import {SearchPageModule} from '../../+search-page/search-page.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EditItemPageRoutingModule,
    SearchPageModule.forRoot(),
  ],
  declarations: [
    EditItemPageComponent,
    ItemOperationComponent,
    ItemMoveComponent,
    ItemStatusComponent
  ]
})
export class EditItemPageModule {

}
