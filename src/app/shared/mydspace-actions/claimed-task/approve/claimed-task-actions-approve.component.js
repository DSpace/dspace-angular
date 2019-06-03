import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
var ClaimedTaskActionsApproveComponent = /** @class */ (function () {
    function ClaimedTaskActionsApproveComponent() {
        /**
         * An event fired when a approve action is confirmed.
         */
        this.approve = new EventEmitter();
    }
    /**
     * Emit approve event
     */
    ClaimedTaskActionsApproveComponent.prototype.confirmApprove = function () {
        this.approve.emit();
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], ClaimedTaskActionsApproveComponent.prototype, "processingApprove", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], ClaimedTaskActionsApproveComponent.prototype, "wrapperClass", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ClaimedTaskActionsApproveComponent.prototype, "approve", void 0);
    ClaimedTaskActionsApproveComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-claimed-task-actions-approve',
            styleUrls: ['./claimed-task-actions-approve.component.scss'],
            templateUrl: './claimed-task-actions-approve.component.html',
        })
    ], ClaimedTaskActionsApproveComponent);
    return ClaimedTaskActionsApproveComponent;
}());
export { ClaimedTaskActionsApproveComponent };
//# sourceMappingURL=claimed-task-actions-approve.component.js.map