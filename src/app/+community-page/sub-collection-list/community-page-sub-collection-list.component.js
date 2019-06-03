import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { Community } from '../../core/shared/community.model';
import { fadeIn } from '../../shared/animations/fade';
var CommunityPageSubCollectionListComponent = /** @class */ (function () {
    function CommunityPageSubCollectionListComponent() {
    }
    CommunityPageSubCollectionListComponent.prototype.ngOnInit = function () {
        this.subCollectionsRDObs = this.community.collections;
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Community)
    ], CommunityPageSubCollectionListComponent.prototype, "community", void 0);
    CommunityPageSubCollectionListComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-community-page-sub-collection-list',
            styleUrls: ['./community-page-sub-collection-list.component.scss'],
            templateUrl: './community-page-sub-collection-list.component.html',
            animations: [fadeIn]
        })
    ], CommunityPageSubCollectionListComponent);
    return CommunityPageSubCollectionListComponent;
}());
export { CommunityPageSubCollectionListComponent };
//# sourceMappingURL=community-page-sub-collection-list.component.js.map