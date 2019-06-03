import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
var ClaimedTaskActionsReturnToPoolComponent = /** @class */ (function () {
    function ClaimedTaskActionsReturnToPoolComponent() {
        /**
         * An event fired when a return to pool action is confirmed.
         */
        this.returnToPool = new EventEmitter();
    }
    /**
     * Emit returnToPool event
     */
    ClaimedTaskActionsReturnToPoolComponent.prototype.confirmReturnToPool = function () {
        this.returnToPool.emit();
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], ClaimedTaskActionsReturnToPoolComponent.prototype, "processingReturnToPool", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], ClaimedTaskActionsReturnToPoolComponent.prototype, "wrapperClass", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ClaimedTaskActionsReturnToPoolComponent.prototype, "returnToPool", void 0);
    ClaimedTaskActionsReturnToPoolComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-claimed-task-actions-return-to-pool',
            styleUrls: ['./claimed-task-actions-return-to-pool.component.scss'],
            templateUrl: './claimed-task-actions-return-to-pool.component.html',
        })
    ], ClaimedTaskActionsReturnToPoolComponent);
    return ClaimedTaskActionsReturnToPoolComponent;
}());
export { ClaimedTaskActionsReturnToPoolComponent };
//# sourceMappingURL=claimed-task-actions-return-to-pool.component.js.map