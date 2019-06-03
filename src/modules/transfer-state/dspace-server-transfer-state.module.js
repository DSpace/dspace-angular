import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { ServerTransferStateModule } from '@angular/platform-server';
import { DSpaceServerTransferState } from './dspace-server-transfer-state.service';
import { DSpaceTransferState } from './dspace-transfer-state.service';
var DSpaceServerTransferStateModule = /** @class */ (function () {
    function DSpaceServerTransferStateModule() {
    }
    DSpaceServerTransferStateModule = tslib_1.__decorate([
        NgModule({
            imports: [
                ServerTransferStateModule
            ],
            providers: [
                { provide: DSpaceTransferState, useClass: DSpaceServerTransferState }
            ]
        })
    ], DSpaceServerTransferStateModule);
    return DSpaceServerTransferStateModule;
}());
export { DSpaceServerTransferStateModule };
//# sourceMappingURL=dspace-server-transfer-state.module.js.map