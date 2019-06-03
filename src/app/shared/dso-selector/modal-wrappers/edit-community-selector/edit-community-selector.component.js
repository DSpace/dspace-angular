import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { getCommunityEditPath } from '../../../../+community-page/community-page-routing.module';
import { DSOSelectorModalWrapperComponent, SelectorActionType } from '../dso-selector-modal-wrapper.component';
/**
 * Component to wrap a list of existing communities inside a modal
 * Used to choose a community from to edit
 */
var EditCommunitySelectorComponent = /** @class */ (function (_super) {
    tslib_1.__extends(EditCommunitySelectorComponent, _super);
    function EditCommunitySelectorComponent(activeModal, route, router) {
        var _this = _super.call(this, activeModal, route) || this;
        _this.activeModal = activeModal;
        _this.route = route;
        _this.router = router;
        _this.objectType = DSpaceObjectType.COMMUNITY;
        _this.selectorType = DSpaceObjectType.COMMUNITY;
        _this.action = SelectorActionType.EDIT;
        return _this;
    }
    /**
     * Navigate to the community edit page
     */
    EditCommunitySelectorComponent.prototype.navigate = function (dso) {
        this.router.navigate([getCommunityEditPath(dso.uuid)]);
    };
    EditCommunitySelectorComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-edit-community-selector',
            templateUrl: '../dso-selector-modal-wrapper.component.html',
        }),
        tslib_1.__metadata("design:paramtypes", [NgbActiveModal, ActivatedRoute, Router])
    ], EditCommunitySelectorComponent);
    return EditCommunitySelectorComponent;
}(DSOSelectorModalWrapperComponent));
export { EditCommunitySelectorComponent };
//# sourceMappingURL=edit-community-selector.component.js.map