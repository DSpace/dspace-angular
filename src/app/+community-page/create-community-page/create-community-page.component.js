import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { CommunityDataService } from '../../core/data/community-data.service';
import { RouteService } from '../../shared/services/route.service';
import { Router } from '@angular/router';
import { CreateComColPageComponent } from '../../shared/comcol-forms/create-comcol-page/create-comcol-page.component';
/**
 * Component that represents the page where a user can create a new Community
 */
var CreateCommunityPageComponent = /** @class */ (function (_super) {
    tslib_1.__extends(CreateCommunityPageComponent, _super);
    function CreateCommunityPageComponent(communityDataService, routeService, router) {
        var _this = _super.call(this, communityDataService, communityDataService, routeService, router) || this;
        _this.communityDataService = communityDataService;
        _this.routeService = routeService;
        _this.router = router;
        _this.frontendURL = '/communities/';
        return _this;
    }
    CreateCommunityPageComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-create-community',
            styleUrls: ['./create-community-page.component.scss'],
            templateUrl: './create-community-page.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [CommunityDataService,
            RouteService,
            Router])
    ], CreateCommunityPageComponent);
    return CreateCommunityPageComponent;
}(CreateComColPageComponent));
export { CreateCommunityPageComponent };
//# sourceMappingURL=create-community-page.component.js.map