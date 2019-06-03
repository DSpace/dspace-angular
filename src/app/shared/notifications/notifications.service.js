import * as tslib_1 from "tslib";
import { Inject, Injectable } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { first } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { uniqueId } from 'lodash';
import { Notification } from './models/notification.model';
import { NotificationType } from './models/notification-type';
import { NotificationOptions } from './models/notification-options.model';
import { NewNotificationAction, RemoveAllNotificationsAction, RemoveNotificationAction } from './notifications.actions';
import { GLOBAL_CONFIG } from '../../../config';
var NotificationsService = /** @class */ (function () {
    function NotificationsService(config, store, translate) {
        this.config = config;
        this.store = store;
        this.translate = translate;
    }
    NotificationsService.prototype.add = function (notification) {
        var notificationAction;
        notificationAction = new NewNotificationAction(notification);
        this.store.dispatch(notificationAction);
    };
    NotificationsService.prototype.success = function (title, content, options, html) {
        if (title === void 0) { title = observableOf(''); }
        if (content === void 0) { content = observableOf(''); }
        if (options === void 0) { options = {}; }
        if (html === void 0) { html = false; }
        var notificationOptions = tslib_1.__assign({}, this.getDefaultOptions(), options);
        var notification = new Notification(uniqueId(), NotificationType.Success, title, content, notificationOptions, html);
        this.add(notification);
        return notification;
    };
    NotificationsService.prototype.error = function (title, content, options, html) {
        if (title === void 0) { title = observableOf(''); }
        if (content === void 0) { content = observableOf(''); }
        if (options === void 0) { options = {}; }
        if (html === void 0) { html = false; }
        var notificationOptions = tslib_1.__assign({}, this.getDefaultOptions(), options);
        var notification = new Notification(uniqueId(), NotificationType.Error, title, content, notificationOptions, html);
        this.add(notification);
        return notification;
    };
    NotificationsService.prototype.info = function (title, content, options, html) {
        if (title === void 0) { title = observableOf(''); }
        if (content === void 0) { content = observableOf(''); }
        if (options === void 0) { options = {}; }
        if (html === void 0) { html = false; }
        var notificationOptions = tslib_1.__assign({}, this.getDefaultOptions(), options);
        var notification = new Notification(uniqueId(), NotificationType.Info, title, content, notificationOptions, html);
        this.add(notification);
        return notification;
    };
    NotificationsService.prototype.warning = function (title, content, options, html) {
        if (title === void 0) { title = observableOf(''); }
        if (content === void 0) { content = observableOf(''); }
        if (options === void 0) { options = this.getDefaultOptions(); }
        if (html === void 0) { html = false; }
        var notificationOptions = tslib_1.__assign({}, this.getDefaultOptions(), options);
        var notification = new Notification(uniqueId(), NotificationType.Warning, title, content, notificationOptions, html);
        this.add(notification);
        return notification;
    };
    NotificationsService.prototype.notificationWithAnchor = function (notificationType, options, href, hrefTranslateLabel, messageTranslateLabel, interpolateParam) {
        var _this = this;
        this.translate.get(hrefTranslateLabel)
            .pipe(first())
            .subscribe(function (hrefMsg) {
            var anchor = "<a class=\"btn btn-link p-0 m-0\" href=\"" + href + "\" >\n                        <strong>" + hrefMsg + "</strong>\n                      </a>";
            var interpolateParams = Object.create({});
            interpolateParams[interpolateParam] = anchor;
            _this.translate.get(messageTranslateLabel, interpolateParams)
                .pipe(first())
                .subscribe(function (m) {
                switch (notificationType) {
                    case NotificationType.Success:
                        _this.success(null, m, options, true);
                        break;
                    case NotificationType.Error:
                        _this.error(null, m, options, true);
                        break;
                    case NotificationType.Info:
                        _this.info(null, m, options, true);
                        break;
                    case NotificationType.Warning:
                        _this.warning(null, m, options, true);
                        break;
                }
            });
        });
    };
    NotificationsService.prototype.remove = function (notification) {
        var actionRemove = new RemoveNotificationAction(notification.id);
        this.store.dispatch(actionRemove);
    };
    NotificationsService.prototype.removeAll = function () {
        var actionRemoveAll = new RemoveAllNotificationsAction();
        this.store.dispatch(actionRemoveAll);
    };
    NotificationsService.prototype.getDefaultOptions = function () {
        return new NotificationOptions(this.config.notifications.timeOut, this.config.notifications.clickToClose, this.config.notifications.animate);
    };
    NotificationsService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object, Store,
            TranslateService])
    ], NotificationsService);
    return NotificationsService;
}());
export { NotificationsService };
//# sourceMappingURL=notifications.service.js.map