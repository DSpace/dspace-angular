import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { CommunityDataService } from '../../core/data/community-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteComColPageComponent } from '../../shared/comcol-forms/delete-comcol-page/delete-comcol-page.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
/**
 * Component that represents the page where a user can delete an existing Community
 */
var DeleteCommunityPageComponent = /** @class */ (function (_super) {
    tslib_1.__extends(DeleteCommunityPageComponent, _super);
    function DeleteCommunityPageComponent(dsoDataService, router, route, notifications, translate) {
        var _this = _super.call(this, dsoDataService, router, route, notifications, translate) || this;
        _this.dsoDataService = dsoDataService;
        _this.router = router;
        _this.route = route;
        _this.notifications = notifications;
        _this.translate = translate;
        _this.frontendURL = '/communities/';
        return _this;
    }
    DeleteCommunityPageComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-delete-community',
            styleUrls: ['./delete-community-page.component.scss'],
            templateUrl: './delete-community-page.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [CommunityDataService,
            Router,
            ActivatedRoute,
            NotificationsService,
            TranslateService])
    ], DeleteCommunityPageComponent);
    return DeleteCommunityPageComponent;
}(DeleteComColPageComponent));
export { DeleteCommunityPageComponent };
//# sourceMappingURL=delete-community-page.component.js.map