import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { hasValue } from '../../../empty.util';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { COMMUNITY_PARENT_PARAMETER, getCommunityCreatePath } from '../../../../+community-page/community-page-routing.module';
import { DSOSelectorModalWrapperComponent, SelectorActionType } from '../dso-selector-modal-wrapper.component';
/**
 * Component to wrap a button - for top communities -
 * and a list of parent communities - for sub communities
 * inside a modal
 * Used to create a new community
 */
var CreateCommunityParentSelectorComponent = /** @class */ (function (_super) {
    tslib_1.__extends(CreateCommunityParentSelectorComponent, _super);
    function CreateCommunityParentSelectorComponent(activeModal, route, router) {
        var _this = _super.call(this, activeModal, route) || this;
        _this.activeModal = activeModal;
        _this.route = route;
        _this.router = router;
        _this.objectType = DSpaceObjectType.COMMUNITY;
        _this.selectorType = DSpaceObjectType.COMMUNITY;
        _this.action = SelectorActionType.CREATE;
        return _this;
    }
    /**
     * Navigate to the community create page
     */
    CreateCommunityParentSelectorComponent.prototype.navigate = function (dso) {
        var _a;
        var navigationExtras = {};
        if (hasValue(dso)) {
            navigationExtras = {
                queryParams: (_a = {},
                    _a[COMMUNITY_PARENT_PARAMETER] = dso.uuid,
                    _a)
            };
        }
        this.router.navigate([getCommunityCreatePath()], navigationExtras);
    };
    CreateCommunityParentSelectorComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-create-community-parent-selector',
            styleUrls: ['./create-community-parent-selector.component.scss'],
            templateUrl: './create-community-parent-selector.component.html',
        }),
        tslib_1.__metadata("design:paramtypes", [NgbActiveModal, ActivatedRoute, Router])
    ], CreateCommunityParentSelectorComponent);
    return CreateCommunityParentSelectorComponent;
}(DSOSelectorModalWrapperComponent));
export { CreateCommunityParentSelectorComponent };
//# sourceMappingURL=create-community-parent-selector.component.js.map