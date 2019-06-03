import * as tslib_1 from "tslib";
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
var ITEM_EDIT_WITHDRAW_PATH = 'withdraw';
var ITEM_EDIT_REINSTATE_PATH = 'reinstate';
var ITEM_EDIT_PRIVATE_PATH = 'private';
var ITEM_EDIT_PUBLIC_PATH = 'public';
var ITEM_EDIT_DELETE_PATH = 'delete';
/**
 * Routing module that handles the routing for the Edit Item page administrator functionality
 */
var EditItemPageRoutingModule = /** @class */ (function () {
    function EditItemPageRoutingModule() {
    }
    EditItemPageRoutingModule = tslib_1.__decorate([
        NgModule({
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
                    }
                ])
            ],
            providers: [
                ItemPageResolver,
            ]
        })
    ], EditItemPageRoutingModule);
    return EditItemPageRoutingModule;
}());
export { EditItemPageRoutingModule };
//# sourceMappingURL=edit-item-page.routing.module.js.map