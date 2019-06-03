import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first, map } from 'rxjs/operators';
import { DataService } from '../../../core/data/data.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
/**
 * Component representing the delete page for communities and collections
 */
var DeleteComColPageComponent = /** @class */ (function () {
    function DeleteComColPageComponent(dsoDataService, router, route, notifications, translate) {
        this.dsoDataService = dsoDataService;
        this.router = router;
        this.route = route;
        this.notifications = notifications;
        this.translate = translate;
    }
    DeleteComColPageComponent.prototype.ngOnInit = function () {
        this.dsoRD$ = this.route.data.pipe(first(), map(function (data) { return data.dso; }));
    };
    /**
     * @param {TDomain} dso The DSO to delete
     * Deletes an existing DSO and redirects to the home page afterwards, showing a notification that states whether or not the deletion was successful
     */
    DeleteComColPageComponent.prototype.onConfirm = function (dso) {
        var _this = this;
        this.dsoDataService.delete(dso)
            .pipe(first())
            .subscribe(function (success) {
            if (success) {
                var successMessage = _this.translate.instant(dso.type + '.delete.notification.success');
                _this.notifications.success(successMessage);
            }
            else {
                var errorMessage = _this.translate.instant(dso.type + '.delete.notification.fail');
                _this.notifications.error(errorMessage);
            }
            _this.router.navigate(['/']);
        });
    };
    /**
     * @param {TDomain} dso The DSO for which the delete action was canceled
     * When a delete is canceled, the user is redirected to the DSO's edit page
     */
    DeleteComColPageComponent.prototype.onCancel = function (dso) {
        this.router.navigate([this.frontendURL + '/' + dso.uuid + '/edit']);
    };
    DeleteComColPageComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-delete-comcol',
            template: ''
        }),
        tslib_1.__metadata("design:paramtypes", [DataService,
            Router,
            ActivatedRoute,
            NotificationsService,
            TranslateService])
    ], DeleteComColPageComponent);
    return DeleteComColPageComponent;
}());
export { DeleteComColPageComponent };
//# sourceMappingURL=delete-comcol-page.component.js.map