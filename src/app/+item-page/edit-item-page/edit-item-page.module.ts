import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { EditItemPageRoutingModule } from './edit-item-page.routing.module';
import { SearchPageModule } from '../../+search-page/search-page.module';
import { EditItemPageComponent } from './edit-item-page.component';
import { ItemCollectionMapperComponent } from './item-collection-mapper/item-collection-mapper.component';
import { ItemStatusComponent } from './item-status/item-status.component';
import { ItemOperationComponent } from './item-operation/item-operation.component';
import { AbstractSimpleItemActionComponent } from './simple-item-action/abstract-simple-item-action.component';
import { ModifyItemOverviewComponent } from './modify-item-overview/modify-item-overview.component';
import { ItemWithdrawComponent } from './item-withdraw/item-withdraw.component';
import { ItemReinstateComponent } from './item-reinstate/item-reinstate.component';
import { ItemPrivateComponent } from './item-private/item-private.component';
import { ItemPublicComponent } from './item-public/item-public.component';
import { ItemDeleteComponent } from './item-delete/item-delete.component';

/**
 * Module that contains all components related to the Edit Item page administrator functionality
 */
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EditItemPageRoutingModule,
    SearchPageModule
  ],
  declarations: [
    EditItemPageComponent,
    ItemOperationComponent,
    AbstractSimpleItemActionComponent,
    ModifyItemOverviewComponent,
    ItemWithdrawComponent,
    ItemReinstateComponent,
    ItemPrivateComponent,
    ItemPublicComponent,
    ItemDeleteComponent,
    ItemStatusComponent,
    ItemCollectionMapperComponent
  ]
})
export class EditItemPageModule {

}
