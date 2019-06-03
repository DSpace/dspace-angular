import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { getItemEditPath } from '../../../../+item-page/item-page-routing.module';
import { DSOSelectorModalWrapperComponent, SelectorActionType } from '../dso-selector-modal-wrapper.component';
/**
 * Component to wrap a list of existing items inside a modal
 * Used to choose an item from to edit
 */
var EditItemSelectorComponent = /** @class */ (function (_super) {
    tslib_1.__extends(EditItemSelectorComponent, _super);
    function EditItemSelectorComponent(activeModal, route, router) {
        var _this = _super.call(this, activeModal, route) || this;
        _this.activeModal = activeModal;
        _this.route = route;
        _this.router = router;
        _this.objectType = DSpaceObjectType.ITEM;
        _this.selectorType = DSpaceObjectType.ITEM;
        _this.action = SelectorActionType.EDIT;
        return _this;
    }
    /**
     * Navigate to the item edit page
     */
    EditItemSelectorComponent.prototype.navigate = function (dso) {
        this.router.navigate([getItemEditPath(dso.uuid)]);
    };
    EditItemSelectorComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-edit-item-selector',
            templateUrl: '../dso-selector-modal-wrapper.component.html',
        }),
        tslib_1.__metadata("design:paramtypes", [NgbActiveModal, ActivatedRoute, Router])
    ], EditItemSelectorComponent);
    return EditItemSelectorComponent;
}(DSOSelectorModalWrapperComponent));
export { EditItemSelectorComponent };
//# sourceMappingURL=edit-item-selector.component.js.map