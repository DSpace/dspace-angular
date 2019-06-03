import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
var DSpaceTransferState = /** @class */ (function () {
    function DSpaceTransferState(transferState, store) {
        this.transferState = transferState;
        this.store = store;
    }
    DSpaceTransferState.NGRX_STATE = makeStateKey('NGRX_STATE');
    DSpaceTransferState = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [TransferState,
            Store])
    ], DSpaceTransferState);
    return DSpaceTransferState;
}());
export { DSpaceTransferState };
//# sourceMappingURL=dspace-transfer-state.service.js.map