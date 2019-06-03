import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { DSpaceBrowserTransferState } from './dspace-browser-transfer-state.service';
import { DSpaceTransferState } from './dspace-transfer-state.service';
var DSpaceBrowserTransferStateModule = /** @class */ (function () {
    function DSpaceBrowserTransferStateModule() {
    }
    DSpaceBrowserTransferStateModule = tslib_1.__decorate([
        NgModule({
            imports: [
                BrowserTransferStateModule
            ],
            providers: [
                { provide: DSpaceTransferState, useClass: DSpaceBrowserTransferState }
            ]
        })
    ], DSpaceBrowserTransferStateModule);
    return DSpaceBrowserTransferStateModule;
}());
export { DSpaceBrowserTransferStateModule };
//# sourceMappingURL=dspace-browser-transfer-state.module.js.map