import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemPageComponent } from './simple/item-page.component';
import { FullItemPageComponent } from './full/full-item-page.component';
import { ItemPageResolver } from './item-page.resolver';
import { URLCombiner } from '../core/url-combiner/url-combiner';
import { getItemModulePath } from '../app-routing.module';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
export function getItemPageRoute(itemId) {
    return new URLCombiner(getItemModulePath(), itemId).toString();
}
export function getItemEditPath(id) {
    return new URLCombiner(getItemModulePath(), ITEM_EDIT_PATH.replace(/:id/, id)).toString();
}
var ITEM_EDIT_PATH = ':id/edit';
var ItemPageRoutingModule = /** @class */ (function () {
    function ItemPageRoutingModule() {
    }
    ItemPageRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [
                RouterModule.forChild([
                    {
                        path: ':id',
                        component: ItemPageComponent,
                        pathMatch: 'full',
                        resolve: {
                            item: ItemPageResolver
                        }
                    },
                    {
                        path: ':id/full',
                        component: FullItemPageComponent,
                        resolve: {
                            item: ItemPageResolver
                        }
                    },
                    {
                        path: ITEM_EDIT_PATH,
                        loadChildren: './edit-item-page/edit-item-page.module#EditItemPageModule',
                        canActivate: [AuthenticatedGuard]
                    },
                ])
            ],
            providers: [
                ItemPageResolver,
            ]
        })
    ], ItemPageRoutingModule);
    return ItemPageRoutingModule;
}());
export { ItemPageRoutingModule };
//# sourceMappingURL=item-page-routing.module.js.map