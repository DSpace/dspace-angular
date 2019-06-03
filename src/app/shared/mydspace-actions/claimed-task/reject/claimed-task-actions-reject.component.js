import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
var ClaimedTaskActionsRejectComponent = /** @class */ (function () {
    /**
     * Initialize instance variables
     *
     * @param {FormBuilder} formBuilder
     * @param {NgbModal} modalService
     */
    function ClaimedTaskActionsRejectComponent(formBuilder, modalService) {
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        /**
         * An event fired when a reject action is confirmed.
         * Event's payload equals to reject reason.
         */
        this.reject = new EventEmitter();
    }
    /**
     * Initialize form
     */
    ClaimedTaskActionsRejectComponent.prototype.ngOnInit = function () {
        this.rejectForm = this.formBuilder.group({
            reason: ['', Validators.required]
        });
    };
    /**
     * Close modal and emit reject event
     */
    ClaimedTaskActionsRejectComponent.prototype.confirmReject = function () {
        this.processingReject = true;
        this.modalRef.close('Send Button');
        var reason = this.rejectForm.get('reason').value;
        this.reject.emit(reason);
    };
    /**
     * Open modal
     *
     * @param content
     */
    ClaimedTaskActionsRejectComponent.prototype.openRejectModal = function (content) {
        this.rejectForm.reset();
        this.modalRef = this.modalService.open(content);
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], ClaimedTaskActionsRejectComponent.prototype, "processingReject", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], ClaimedTaskActionsRejectComponent.prototype, "wrapperClass", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ClaimedTaskActionsRejectComponent.prototype, "reject", void 0);
    ClaimedTaskActionsRejectComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-claimed-task-actions-reject',
            styleUrls: ['./claimed-task-actions-reject.component.scss'],
            templateUrl: './claimed-task-actions-reject.component.html',
        }),
        tslib_1.__metadata("design:paramtypes", [FormBuilder, NgbModal])
    ], ClaimedTaskActionsRejectComponent);
    return ClaimedTaskActionsRejectComponent;
}());
export { ClaimedTaskActionsRejectComponent };
//# sourceMappingURL=claimed-task-actions-reject.component.js.map