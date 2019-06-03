import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { EditItemPageRoutingModule } from './edit-item-page.routing.module';
import { EditItemPageComponent } from './edit-item-page.component';
import { ItemStatusComponent } from './item-status/item-status.component';
import { ItemOperationComponent } from './item-operation/item-operation.component';
import { ModifyItemOverviewComponent } from './modify-item-overview/modify-item-overview.component';
import { ItemWithdrawComponent } from './item-withdraw/item-withdraw.component';
import { ItemReinstateComponent } from './item-reinstate/item-reinstate.component';
import { AbstractSimpleItemActionComponent } from './simple-item-action/abstract-simple-item-action.component';
import { ItemPrivateComponent } from './item-private/item-private.component';
import { ItemPublicComponent } from './item-public/item-public.component';
import { ItemDeleteComponent } from './item-delete/item-delete.component';
import { ItemMetadataComponent } from './item-metadata/item-metadata.component';
import { EditInPlaceFieldComponent } from './item-metadata/edit-in-place-field/edit-in-place-field.component';
import { ItemBitstreamsComponent } from './item-bitstreams/item-bitstreams.component';
/**
 * Module that contains all components related to the Edit Item page administrator functionality
 */
var EditItemPageModule = /** @class */ (function () {
    function EditItemPageModule() {
    }
    EditItemPageModule = tslib_1.__decorate([
        NgModule({
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
                ItemDeleteComponent,
                ItemStatusComponent,
                ItemMetadataComponent,
                ItemBitstreamsComponent,
                EditInPlaceFieldComponent
            ]
        })
    ], EditItemPageModule);
    return EditItemPageModule;
}());
export { EditItemPageModule };
//# sourceMappingURL=edit-item-page.module.js.map