import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CollectionPageComponent } from './collection-page.component';
import { CollectionPageResolver } from './collection-page.resolver';
import { CreateCollectionPageComponent } from './create-collection-page/create-collection-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { EditCollectionPageComponent } from './edit-collection-page/edit-collection-page.component';
import { CreateCollectionPageGuard } from './create-collection-page/create-collection-page.guard';
import { DeleteCollectionPageComponent } from './delete-collection-page/delete-collection-page.component';
import { URLCombiner } from '../core/url-combiner/url-combiner';
import { getCollectionModulePath } from '../app-routing.module';
export var COLLECTION_PARENT_PARAMETER = 'parent';
export function getCollectionPageRoute(collectionId) {
    return new URLCombiner(getCollectionModulePath(), collectionId).toString();
}
export function getCollectionEditPath(id) {
    return new URLCombiner(getCollectionModulePath(), COLLECTION_EDIT_PATH.replace(/:id/, id)).toString();
}
export function getCollectionCreatePath() {
    return new URLCombiner(getCollectionModulePath(), COLLECTION_CREATE_PATH).toString();
}
var COLLECTION_CREATE_PATH = 'create';
var COLLECTION_EDIT_PATH = ':id/edit';
var CollectionPageRoutingModule = /** @class */ (function () {
    function CollectionPageRoutingModule() {
    }
    CollectionPageRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [
                RouterModule.forChild([
                    {
                        path: COLLECTION_CREATE_PATH,
                        component: CreateCollectionPageComponent,
                        canActivate: [AuthenticatedGuard, CreateCollectionPageGuard]
                    },
                    {
                        path: COLLECTION_EDIT_PATH,
                        pathMatch: 'full',
                        component: EditCollectionPageComponent,
                        canActivate: [AuthenticatedGuard],
                        resolve: {
                            dso: CollectionPageResolver
                        }
                    },
                    {
                        path: ':id/delete',
                        pathMatch: 'full',
                        component: DeleteCollectionPageComponent,
                        canActivate: [AuthenticatedGuard],
                        resolve: {
                            dso: CollectionPageResolver
                        }
                    },
                    {
                        path: ':id',
                        component: CollectionPageComponent,
                        pathMatch: 'full',
                        resolve: {
                            collection: CollectionPageResolver
                        }
                    }
                ])
            ],
            providers: [
                CollectionPageResolver,
                CreateCollectionPageGuard
            ]
        })
    ], CollectionPageRoutingModule);
    return CollectionPageRoutingModule;
}());
export { CollectionPageRoutingModule };
//# sourceMappingURL=collection-page-routing.module.js.map