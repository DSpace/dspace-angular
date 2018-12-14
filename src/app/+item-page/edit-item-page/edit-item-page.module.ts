import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {EditItemPageRoutingModule} from './edit-item-page.routing.module';
import {EditItemPageComponent} from './edit-item-page.component';
import {ItemStatusComponent} from './item-status/item-status.component';
import {ItemOperationComponent} from './item-operation/item-operation.component';
import {ModifyItemOverviewComponent} from './modify-item-overview/modify-item-overview.component';
import {ItemWithdrawComponent} from './item-withdraw/item-withdraw.component';
import {ItemReinstateComponent} from './item-reinstate/item-reinstate.component';
import {AbstractSimpleItemActionComponent} from './simple-item-action/abstract-simple-item-action.component';
import {ItemPrivateComponent} from './item-private/item-private.component';
import {ItemPublicComponent} from './item-public/item-public.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EditItemPageRoutingModule
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
    ItemStatusComponent
  ]
})
export class EditItemPageModule {

}
