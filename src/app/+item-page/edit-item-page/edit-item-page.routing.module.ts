import {ItemPageResolver} from '../item-page.resolver';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {EditItemPageComponent} from './edit-item-page.component';
import {ItemWithdrawComponent} from './item-withdraw/item-withdraw.component';
import {ItemReinstateComponent} from './item-reinstate/item-reinstate.component';
import {ItemPrivateComponent} from './item-private/item-private.component';
import {ItemPublicComponent} from './item-public/item-public.component';
import {ItemDeleteComponent} from './item-delete/item-delete.component';

const ITEM_EDIT_WITHDRAW_PATH = 'withdraw';
const ITEM_EDIT_REINSTATE_PATH = 'reinstate';
const ITEM_EDIT_PRIVATE_PATH = 'private';
const ITEM_EDIT_PUBLIC_PATH = 'public';
const ITEM_EDIT_DELETE_PATH = 'delete';

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
      },
      {
        path: ITEM_EDIT_PRIVATE_PATH,
        component: ItemPrivateComponent,
        resolve: {
          item: ItemPageResolver
        }
      },
      {
        path: ITEM_EDIT_PUBLIC_PATH,
        component: ItemPublicComponent,
        resolve: {
          item: ItemPageResolver
        }
      },
      {
        path: ITEM_EDIT_DELETE_PATH,
        component: ItemDeleteComponent,
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
