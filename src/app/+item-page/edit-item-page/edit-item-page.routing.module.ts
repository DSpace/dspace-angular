import { ItemPageResolver } from '../item-page.resolver';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditItemPageComponent } from './edit-item-page.component';
import { ItemWithdrawComponent } from './item-withdraw/item-withdraw.component';
import { ItemReinstateComponent } from './item-reinstate/item-reinstate.component';
import { ItemPrivateComponent } from './item-private/item-private.component';
import { ItemPublicComponent } from './item-public/item-public.component';
import { ItemDeleteComponent } from './item-delete/item-delete.component';
import { ItemStatusComponent } from './item-status/item-status.component';
import { ItemMetadataComponent } from './item-metadata/item-metadata.component';
import { ItemBitstreamsComponent } from './item-bitstreams/item-bitstreams.component';
import { ItemMoveComponent } from './item-move/item-move.component';
import { ItemRelationshipsComponent } from './item-relationships/item-relationships.component';

const ITEM_EDIT_WITHDRAW_PATH = 'withdraw';
const ITEM_EDIT_REINSTATE_PATH = 'reinstate';
const ITEM_EDIT_PRIVATE_PATH = 'private';
const ITEM_EDIT_PUBLIC_PATH = 'public';
const ITEM_EDIT_DELETE_PATH = 'delete';
const ITEM_EDIT_MOVE_PATH = 'move';

/**
 * Routing module that handles the routing for the Edit Item page administrator functionality
 */
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: EditItemPageComponent,
        resolve: {
          item: ItemPageResolver
        },
        children: [
          {
            path: '',
            redirectTo: 'status',
            pathMatch: 'full'
          },
          {
            path: 'status',
            component: ItemStatusComponent,
            data: { title: 'item.edit.tabs.status.title' }
          },
          {
            path: 'bitstreams',
            component: ItemBitstreamsComponent,
            data: { title: 'item.edit.tabs.bitstreams.title' }
          },
          {
            path: 'metadata',
            component: ItemMetadataComponent,
            data: { title: 'item.edit.tabs.metadata.title' }
          },
          {
            path: 'relationships',
            component: ItemRelationshipsComponent,
            data: { title: 'item.edit.tabs.relationships.title' }
          },
          {
            path: 'view',
            /* TODO - change when view page exists */
            component: ItemBitstreamsComponent,
            data: { title: 'item.edit.tabs.view.title' }
          },
          {
            path: 'curate',
            /* TODO - change when curate page exists */
            component: ItemBitstreamsComponent,
            data: { title: 'item.edit.tabs.curate.title' }
          },
        ]
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
      },
      {
        path: ITEM_EDIT_MOVE_PATH,
        component: ItemMoveComponent,
        data: { title: 'item.edit.move.title' },
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
