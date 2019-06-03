import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteComColPageComponent } from '../../shared/comcol-forms/delete-comcol-page/delete-comcol-page.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { TranslateService } from '@ngx-translate/core';
/**
 * Component that represents the page where a user can delete an existing Collection
 */
var DeleteCollectionPageComponent = /** @class */ (function (_super) {
    tslib_1.__extends(DeleteCollectionPageComponent, _super);
    function DeleteCollectionPageComponent(dsoDataService, router, route, notifications, translate) {
        var _this = _super.call(this, dsoDataService, router, route, notifications, translate) || this;
        _this.dsoDataService = dsoDataService;
        _this.router = router;
        _this.route = route;
        _this.notifications = notifications;
        _this.translate = translate;
        _this.frontendURL = '/collections/';
        return _this;
    }
    DeleteCollectionPageComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-delete-collection',
            styleUrls: ['./delete-collection-page.component.scss'],
            templateUrl: './delete-collection-page.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [CollectionDataService,
            Router,
            ActivatedRoute,
            NotificationsService,
            TranslateService])
    ], DeleteCollectionPageComponent);
    return DeleteCollectionPageComponent;
}(DeleteComColPageComponent));
export { DeleteCollectionPageComponent };
//# sourceMappingURL=delete-collection-page.component.js.map