import {ItemPageResolver} from '../item-page.resolver';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {EditItemPageComponent} from './edit-item-page.component';
import {ItemWithdrawComponent} from './item-withdraw/item-withdraw.component';
import {ItemReinstateComponent} from './item-reinstate/item-reinstate.component';

const ITEM_EDIT_WITHDRAW_PATH = 'withdraw';
const ITEM_EDIT_REINSTATE_PATH = 'reinstate';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: EditItemPageComponent,
        resolve: {
          item: ItemPageResolver
        }
      },
      {
        path: ITEM_EDIT_WITHDRAW_PATH,
        component: ItemWithdrawComponent,
        resolve: {
          item: ItemPageResolver
        }
      },
      {
        path: ITEM_EDIT_REINSTATE_PATH,
        component: ItemReinstateComponent,
        resolve: {
          item: ItemPageResolver
        }
      }])
  ],
  providers: [
    ItemPageResolver,
  ]
})
export class EditItemPageRoutingModule {

}
