import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { CommunityDataService } from '../../core/data/community-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EditComColPageComponent } from '../../shared/comcol-forms/edit-comcol-page/edit-comcol-page.component';
/**
 * Component that represents the page where a user can edit an existing Community
 */
var EditCommunityPageComponent = /** @class */ (function (_super) {
    tslib_1.__extends(EditCommunityPageComponent, _super);
    function EditCommunityPageComponent(communityDataService, router, route) {
        var _this = _super.call(this, communityDataService, router, route) || this;
        _this.communityDataService = communityDataService;
        _this.router = router;
        _this.route = route;
        _this.frontendURL = '/communities/';
        return _this;
    }
    EditCommunityPageComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-edit-community',
            styleUrls: ['./edit-community-page.component.scss'],
            templateUrl: './edit-community-page.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [CommunityDataService,
            Router,
            ActivatedRoute])
    ], EditCommunityPageComponent);
    return EditCommunityPageComponent;
}(EditComColPageComponent));
export { EditCommunityPageComponent };
//# sourceMappingURL=edit-community-page.component.js.map