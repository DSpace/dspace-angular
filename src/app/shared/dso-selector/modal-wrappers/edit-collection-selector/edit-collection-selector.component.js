import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { getCollectionEditPath } from '../../../../+collection-page/collection-page-routing.module';
import { DSOSelectorModalWrapperComponent, SelectorActionType } from '../dso-selector-modal-wrapper.component';
/**
 * Component to wrap a list of existing collections inside a modal
 * Used to choose a collection from to edit
 */
var EditCollectionSelectorComponent = /** @class */ (function (_super) {
    tslib_1.__extends(EditCollectionSelectorComponent, _super);
    function EditCollectionSelectorComponent(activeModal, route, router) {
        var _this = _super.call(this, activeModal, route) || this;
        _this.activeModal = activeModal;
        _this.route = route;
        _this.router = router;
        _this.objectType = DSpaceObjectType.COLLECTION;
        _this.selectorType = DSpaceObjectType.COLLECTION;
        _this.action = SelectorActionType.EDIT;
        return _this;
    }
    /**
     * Navigate to the collection edit page
     */
    EditCollectionSelectorComponent.prototype.navigate = function (dso) {
        this.router.navigate([getCollectionEditPath(dso.uuid)]);
    };
    EditCollectionSelectorComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-edit-collection-selector',
            templateUrl: '../dso-selector-modal-wrapper.component.html',
        }),
        tslib_1.__metadata("design:paramtypes", [NgbActiveModal, ActivatedRoute, Router])
    ], EditCollectionSelectorComponent);
    return EditCollectionSelectorComponent;
}(DSOSelectorModalWrapperComponent));
export { EditCollectionSelectorComponent };
//# sourceMappingURL=edit-collection-selector.component.js.map