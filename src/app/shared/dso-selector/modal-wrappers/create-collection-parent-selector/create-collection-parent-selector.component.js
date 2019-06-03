import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { COLLECTION_PARENT_PARAMETER, getCollectionCreatePath } from '../../../../+collection-page/collection-page-routing.module';
import { DSOSelectorModalWrapperComponent, SelectorActionType } from '../dso-selector-modal-wrapper.component';
/**
 * Component to wrap a list of existing communities inside a modal
 * Used to choose a community from to create a new collection in
 */
var CreateCollectionParentSelectorComponent = /** @class */ (function (_super) {
    tslib_1.__extends(CreateCollectionParentSelectorComponent, _super);
    function CreateCollectionParentSelectorComponent(activeModal, route, router) {
        var _this = _super.call(this, activeModal, route) || this;
        _this.activeModal = activeModal;
        _this.route = route;
        _this.router = router;
        _this.objectType = DSpaceObjectType.COLLECTION;
        _this.selectorType = DSpaceObjectType.COMMUNITY;
        _this.action = SelectorActionType.CREATE;
        return _this;
    }
    /**
     * Navigate to the collection create page
     */
    CreateCollectionParentSelectorComponent.prototype.navigate = function (dso) {
        var _a;
        var navigationExtras = {
            queryParams: (_a = {},
                _a[COLLECTION_PARENT_PARAMETER] = dso.uuid,
                _a)
        };
        this.router.navigate([getCollectionCreatePath()], navigationExtras);
    };
    CreateCollectionParentSelectorComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-create-collection-parent-selector',
            templateUrl: '../dso-selector-modal-wrapper.component.html',
        }),
        tslib_1.__metadata("design:paramtypes", [NgbActiveModal, ActivatedRoute, Router])
    ], CreateCollectionParentSelectorComponent);
    return CreateCollectionParentSelectorComponent;
}(DSOSelectorModalWrapperComponent));
export { CreateCollectionParentSelectorComponent };
//# sourceMappingURL=create-collection-parent-selector.component.js.map