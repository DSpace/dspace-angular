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
import { ItemCollectionMapperComponent } from './item-collection-mapper/item-collection-mapper.component';
import { ItemMoveComponent } from './item-move/item-move.component';
import { ItemRelationshipsComponent } from './item-relationships/item-relationships.component';
import { I18nBreadcrumbResolver } from '../../core/breadcrumbs/i18n-breadcrumb.resolver';
import { ItemVersionHistoryComponent } from './item-version-history/item-version-history.component';

export const ITEM_EDIT_WITHDRAW_PATH = 'withdraw';
export const ITEM_EDIT_REINSTATE_PATH = 'reinstate';
export const ITEM_EDIT_PRIVATE_PATH = 'private';
export const ITEM_EDIT_PUBLIC_PATH = 'public';
export const ITEM_EDIT_DELETE_PATH = 'delete';
export const ITEM_EDIT_MOVE_PATH = 'move';

/**
 * Routing module that handles the routing for the Edit Item page administrator functionality
 */
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        resolve: {
          breadcrumb: I18nBreadcrumbResolver
        },
        data: { breadcrumbKey: 'item.edit' },
        children: [
          {
            path: '',
            component: EditItemPageComponent,
            children: [
              {
                path: '',
                redirectTo: 'status',
                pathMatch: 'full'
              },
              {
                path: 'status',
                component: ItemStatusComponent,
                data: { title: 'item.edit.tabs.status.title', showBreadcrumbs: true }
              },
              {
                path: 'bitstreams',
                component: ItemBitstreamsComponent,
                data: { title: 'item.edit.tabs.bitstreams.title', showBreadcrumbs: true }
              },
              {
                path: 'metadata',
                component: ItemMetadataComponent,
                data: { title: 'item.edit.tabs.metadata.title', showBreadcrumbs: true }
              },
              {
                path: 'relationships',
                component: ItemRelationshipsComponent,
                data: { title: 'item.edit.tabs.relationships.title', showBreadcrumbs: true }
              },
              {
                path: 'view',
                /* TODO - change when view page exists */
                component: ItemBitstreamsComponent,
                data: { title: 'item.edit.tabs.view.title', showBreadcrumbs: true }
              },
              {
                path: 'curate',
                /* TODO - change when curate page exists */
                component: ItemBitstreamsComponent,
                data: { title: 'item.edit.tabs.curate.title', showBreadcrumbs: true }
              },
              {
                path: 'versionhistory',
                component: ItemVersionHistoryComponent,
                data: { title: 'item.edit.tabs.versionhistory.title', showBreadcrumbs: true }
              }
            ]
          },
          {
            path: 'mapper',
            component: ItemCollectionMapperComponent,
          },
          {
            path: ITEM_EDIT_WITHDRAW_PATH,
            component: ItemWithdrawComponent,
          },
          {
            path: ITEM_EDIT_REINSTATE_PATH,
            component: ItemReinstateComponent,
          },
          {
            path: ITEM_EDIT_PRIVATE_PATH,
            component: ItemPrivateComponent,
          },
          {
            path: ITEM_EDIT_PUBLIC_PATH,
            component: ItemPublicComponent,
          },
          {
            path: ITEM_EDIT_DELETE_PATH,
            component: ItemDeleteComponent,
          },
          {
            path: ITEM_EDIT_MOVE_PATH,
            component: ItemMoveComponent,
            data: { title: 'item.edit.move.title' },
          }
        ]
      }
    ])
  ],
  providers: []
})
export class EditItemPageRoutingModule {

}
