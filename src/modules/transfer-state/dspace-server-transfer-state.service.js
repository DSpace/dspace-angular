import * as tslib_1 from "tslib";
import { take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { DSpaceTransferState } from './dspace-transfer-state.service';
var DSpaceServerTransferState = /** @class */ (function (_super) {
    tslib_1.__extends(DSpaceServerTransferState, _super);
    function DSpaceServerTransferState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DSpaceServerTransferState.prototype.transfer = function () {
        var _this = this;
        this.transferState.onSerialize(DSpaceTransferState.NGRX_STATE, function () {
            var state;
            _this.store.pipe(take(1)).subscribe(function (saveState) {
                state = saveState;
            });
            return state;
        });
    };
    DSpaceServerTransferState = tslib_1.__decorate([
        Injectable()
    ], DSpaceServerTransferState);
    return DSpaceServerTransferState;
}(DSpaceTransferState));
export { DSpaceServerTransferState };
//# sourceMappingURL=dspace-server-transfer-state.service.js.map