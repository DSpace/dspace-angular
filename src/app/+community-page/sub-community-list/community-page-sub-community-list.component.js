import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { Community } from '../../core/shared/community.model';
import { fadeIn } from '../../shared/animations/fade';
var CommunityPageSubCommunityListComponent = /** @class */ (function () {
    /**
     * Component to render the sub-communities of a Community
     */
    function CommunityPageSubCommunityListComponent() {
    }
    CommunityPageSubCommunityListComponent.prototype.ngOnInit = function () {
        this.subCommunitiesRDObs = this.community.subcommunities;
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Community)
    ], CommunityPageSubCommunityListComponent.prototype, "community", void 0);
    CommunityPageSubCommunityListComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-community-page-sub-community-list',
            styleUrls: ['./community-page-sub-community-list.component.scss'],
            templateUrl: './community-page-sub-community-list.component.html',
            animations: [fadeIn]
        })
        /**
         * Component to render the sub-communities of a Community
         */
    ], CommunityPageSubCommunityListComponent);
    return CommunityPageSubCommunityListComponent;
}());
export { CommunityPageSubCommunityListComponent };
//# sourceMappingURL=community-page-sub-community-list.component.js.map