import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DSOSelectorModalWrapperComponent, SelectorActionType } from '../dso-selector-modal-wrapper.component';
/**
 * Component to wrap a list of existing collections inside a modal
 * Used to choose a collection from to create a new item in
 */
var CreateItemParentSelectorComponent = /** @class */ (function (_super) {
    tslib_1.__extends(CreateItemParentSelectorComponent, _super);
    function CreateItemParentSelectorComponent(activeModal, route, router) {
        var _this = _super.call(this, activeModal, route) || this;
        _this.activeModal = activeModal;
        _this.route = route;
        _this.router = router;
        _this.objectType = DSpaceObjectType.ITEM;
        _this.selectorType = DSpaceObjectType.COLLECTION;
        _this.action = SelectorActionType.CREATE;
        return _this;
    }
    /**
     * Navigate to the item create page
     */
    CreateItemParentSelectorComponent.prototype.navigate = function (dso) {
        // There's no submit path per collection yet...
    };
    CreateItemParentSelectorComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-create-item-parent-selector',
            // styleUrls: ['./create-item-parent-selector.component.scss'],
            templateUrl: '../dso-selector-modal-wrapper.component.html',
        }),
        tslib_1.__metadata("design:paramtypes", [NgbActiveModal, ActivatedRoute, Router])
    ], CreateItemParentSelectorComponent);
    return CreateItemParentSelectorComponent;
}(DSOSelectorModalWrapperComponent));
export { CreateItemParentSelectorComponent };
//# sourceMappingURL=create-item-parent-selector.component.js.map