import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { difference } from 'lodash';
import { NotificationsService } from '../notifications.service';
import { notificationsStateSelector } from '../selectors';
var NotificationsBoardComponent = /** @class */ (function () {
    function NotificationsBoardComponent(service, store, cdr) {
        this.service = service;
        this.store = store;
        this.cdr = cdr;
        this.notifications = [];
        this.position = ['bottom', 'right'];
        // Received values
        this.maxStack = 8;
        // Sent values
        this.rtl = false;
        this.animate = 'fromRight';
    }
    Object.defineProperty(NotificationsBoardComponent.prototype, "options", {
        set: function (opt) {
            this.attachChanges(opt);
        },
        enumerable: true,
        configurable: true
    });
    NotificationsBoardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.store.pipe(select(notificationsStateSelector))
            .subscribe(function (state) {
            if (state.length === 0) {
                _this.notifications = [];
            }
            else if (state.length > _this.notifications.length) {
                // Add
                var newElem = difference(state, _this.notifications);
                newElem.forEach(function (notification) {
                    _this.add(notification);
                });
            }
            else {
                // Remove
                var delElem = difference(_this.notifications, state);
                delElem.forEach(function (notification) {
                    _this.notifications = _this.notifications.filter(function (item) { return item.id !== notification.id; });
                });
            }
            _this.cdr.detectChanges();
        });
    };
    // Add the new notification to the notification array
    NotificationsBoardComponent.prototype.add = function (item) {
        var toBlock = this.block(item);
        if (!toBlock) {
            if (this.notifications.length >= this.maxStack) {
                this.notifications.splice(this.notifications.length - 1, 1);
            }
            this.notifications.splice(0, 0, item);
        }
        else {
            // Remove the notification from the store
            // This notification was in the store, but not in this.notifications
            // because it was a blocked duplicate
            this.service.remove(item);
        }
    };
    NotificationsBoardComponent.prototype.block = function (item) {
        var toCheck = item.html ? this.checkHtml : this.checkStandard;
        this.notifications.forEach(function (notification) {
            if (toCheck(notification, item)) {
                return true;
            }
        });
        if (this.notifications.length > 0) {
            this.notifications.forEach(function (notification) {
                if (toCheck(notification, item)) {
                    return true;
                }
            });
        }
        var comp;
        if (this.notifications.length > 0) {
            comp = this.notifications[0];
        }
        else {
            return false;
        }
        return toCheck(comp, item);
    };
    NotificationsBoardComponent.prototype.checkStandard = function (checker, item) {
        return checker.type === item.type && checker.title === item.title && checker.content === item.content;
    };
    NotificationsBoardComponent.prototype.checkHtml = function (checker, item) {
        return checker.html ? checker.type === item.type && checker.title === item.title && checker.content === item.content && checker.html === item.html : false;
    };
    // Attach all the changes received in the options object
    NotificationsBoardComponent.prototype.attachChanges = function (options) {
        var _this = this;
        Object.keys(options).forEach(function (a) {
            if (_this.hasOwnProperty(a)) {
                _this[a] = options[a];
            }
        });
    };
    NotificationsBoardComponent.prototype.ngOnDestroy = function () {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], NotificationsBoardComponent.prototype, "options", null);
    NotificationsBoardComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-notifications-board',
            encapsulation: ViewEncapsulation.None,
            templateUrl: './notifications-board.component.html',
            styleUrls: ['./notifications-board.component.scss'],
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        tslib_1.__metadata("design:paramtypes", [NotificationsService,
            Store,
            ChangeDetectorRef])
    ], NotificationsBoardComponent);
    return NotificationsBoardComponent;
}());
export { NotificationsBoardComponent };
//# sourceMappingURL=notifications-board.component.js.map