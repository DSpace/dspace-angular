import * as tslib_1 from "tslib";
import { Injectable, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';
export var SelectorActionType;
(function (SelectorActionType) {
    SelectorActionType["CREATE"] = "create";
    SelectorActionType["EDIT"] = "edit";
})(SelectorActionType || (SelectorActionType = {}));
/**
 * Abstract base class that represents a wrapper for modal content used to select a DSpace Object
 */
var DSOSelectorModalWrapperComponent = /** @class */ (function () {
    function DSOSelectorModalWrapperComponent(activeModal, route) {
        this.activeModal = activeModal;
        this.route = route;
    }
    /**
     * Get de current page's DSO based on the selectorType
     */
    DSOSelectorModalWrapperComponent.prototype.ngOnInit = function () {
        var typeString = this.selectorType.toString().toLowerCase();
        this.dsoRD$ = this.route.root.firstChild.firstChild.data.pipe(map(function (data) { return data[typeString]; }));
    };
    /**
     * Method called when an object has been selected
     * @param dso The selected DSpaceObject
     */
    DSOSelectorModalWrapperComponent.prototype.selectObject = function (dso) {
        this.close();
        this.navigate(dso);
    };
    /**
     * Close the modal
     */
    DSOSelectorModalWrapperComponent.prototype.close = function () {
        this.activeModal.close();
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Observable)
    ], DSOSelectorModalWrapperComponent.prototype, "dsoRD$", void 0);
    DSOSelectorModalWrapperComponent = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [NgbActiveModal, ActivatedRoute])
    ], DSOSelectorModalWrapperComponent);
    return DSOSelectorModalWrapperComponent;
}());
export { DSOSelectorModalWrapperComponent };
//# sourceMappingURL=dso-selector-modal-wrapper.component.js.map