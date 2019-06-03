import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CollectionPageComponent } from './collection-page.component';
import { CollectionPageRoutingModule } from './collection-page-routing.module';
import { CreateCollectionPageComponent } from './create-collection-page/create-collection-page.component';
import { CollectionFormComponent } from './collection-form/collection-form.component';
import { EditCollectionPageComponent } from './edit-collection-page/edit-collection-page.component';
import { DeleteCollectionPageComponent } from './delete-collection-page/delete-collection-page.component';
import { SearchService } from '../+search-page/search-service/search.service';
var CollectionPageModule = /** @class */ (function () {
    function CollectionPageModule() {
    }
    CollectionPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                SharedModule,
                CollectionPageRoutingModule
            ],
            declarations: [
                CollectionPageComponent,
                CreateCollectionPageComponent,
                EditCollectionPageComponent,
                DeleteCollectionPageComponent,
                CollectionFormComponent
            ],
            providers: [
                SearchService
            ]
        })
    ], CollectionPageModule);
    return CollectionPageModule;
}());
export { CollectionPageModule };
//# sourceMappingURL=collection-page.module.js.map