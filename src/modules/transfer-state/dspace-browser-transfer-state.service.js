import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { StoreAction, StoreActionTypes } from '../../app/store.actions';
import { DSpaceTransferState } from './dspace-transfer-state.service';
var DSpaceBrowserTransferState = /** @class */ (function (_super) {
    tslib_1.__extends(DSpaceBrowserTransferState, _super);
    function DSpaceBrowserTransferState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DSpaceBrowserTransferState.prototype.transfer = function () {
        var state = this.transferState.get(DSpaceTransferState.NGRX_STATE, null);
        this.transferState.remove(DSpaceTransferState.NGRX_STATE);
        this.store.dispatch(new StoreAction(StoreActionTypes.REHYDRATE, state));
    };
    DSpaceBrowserTransferState = tslib_1.__decorate([
        Injectable()
    ], DSpaceBrowserTransferState);
    return DSpaceBrowserTransferState;
}(DSpaceTransferState));
export { DSpaceBrowserTransferState };
//# sourceMappingURL=dspace-browser-transfer-state.service.js.map