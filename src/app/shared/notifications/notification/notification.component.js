import * as tslib_1 from "tslib";
import { of as observableOf, Observable } from 'rxjs';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone, TemplateRef, ViewEncapsulation } from '@angular/core';
import { trigger } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationsService } from '../notifications.service';
import { scaleEnter, scaleInState, scaleLeave, scaleOutState } from '../../animations/scale';
import { rotateEnter, rotateInState, rotateLeave, rotateOutState } from '../../animations/rotate';
import { fromBottomEnter, fromBottomInState, fromBottomLeave, fromBottomOutState } from '../../animations/fromBottom';
import { fromRightEnter, fromRightInState, fromRightLeave, fromRightOutState } from '../../animations/fromRight';
import { fromLeftEnter, fromLeftInState, fromLeftLeave, fromLeftOutState } from '../../animations/fromLeft';
import { fromTopEnter, fromTopInState, fromTopLeave, fromTopOutState } from '../../animations/fromTop';
import { fadeInEnter, fadeInState, fadeOutLeave, fadeOutState } from '../../animations/fade';
import { NotificationAnimationsStatus } from '../models/notification-animations-type';
import { isNotEmpty } from '../../empty.util';
var NotificationComponent = /** @class */ (function () {
    function NotificationComponent(notificationService, domSanitizer, cdr, zone) {
        var _this = this;
        this.notificationService = notificationService;
        this.domSanitizer = domSanitizer;
        this.cdr = cdr;
        this.zone = zone;
        this.notification = null;
        this.showProgressBar = false;
        this.titleIsTemplate = false;
        this.contentIsTemplate = false;
        this.htmlIsTemplate = false;
        this.progressWidth = 0;
        this.stopTime = false;
        this.count = 0;
        this.instance = function () {
            _this.diff = (new Date().getTime() - _this.start) - (_this.count * _this.speed);
            if (_this.count++ === _this.steps) {
                _this.remove();
                // this.item.timeoutEnd!.emit();
            }
            else if (!_this.stopTime) {
                if (_this.showProgressBar) {
                    _this.progressWidth += 100 / _this.steps;
                }
                _this.timer = setTimeout(_this.instance, (_this.speed - _this.diff));
            }
            _this.zone.run(function () { return _this.cdr.detectChanges(); });
        };
    }
    NotificationComponent.prototype.ngOnInit = function () {
        this.animate = this.notification.options.animate + NotificationAnimationsStatus.In;
        if (this.notification.options.timeOut !== 0) {
            this.startTimeOut();
            this.showProgressBar = true;
        }
        this.html = this.notification.html;
        this.contentType(this.notification.title, 'title');
        this.contentType(this.notification.content, 'content');
    };
    NotificationComponent.prototype.startTimeOut = function () {
        var _this = this;
        this.steps = this.notification.options.timeOut / 10;
        this.speed = this.notification.options.timeOut / this.steps;
        this.start = new Date().getTime();
        this.zone.runOutsideAngular(function () { return _this.timer = setTimeout(_this.instance, _this.speed); });
    };
    NotificationComponent.prototype.ngOnDestroy = function () {
        clearTimeout(this.timer);
    };
    NotificationComponent.prototype.remove = function () {
        var _this = this;
        if (this.animate) {
            this.setAnimationOut();
            setTimeout(function () {
                _this.notificationService.remove(_this.notification);
            }, 1000);
        }
        else {
            this.notificationService.remove(this.notification);
        }
    };
    NotificationComponent.prototype.contentType = function (item, key) {
        if (item instanceof TemplateRef) {
            this[key] = item;
        }
        else if (key === 'title' || (key === 'content' && !this.html)) {
            var value = null;
            if (isNotEmpty(item)) {
                if (typeof item === 'string') {
                    value = observableOf(item);
                }
                else if (item instanceof Observable) {
                    value = item;
                }
                else if (typeof item === 'object' && isNotEmpty(item.value)) {
                    // when notifications state is transferred from SSR to CSR,
                    // Observables Object loses the instance type and become simply object,
                    // so converts it again to Observable
                    value = observableOf(item.value);
                }
            }
            this[key] = value;
        }
        else {
            this[key] = this.domSanitizer.bypassSecurityTrustHtml(item);
        }
        this[key + 'IsTemplate'] = item instanceof TemplateRef;
    };
    NotificationComponent.prototype.setAnimationOut = function () {
        this.animate = this.notification.options.animate + NotificationAnimationsStatus.Out;
        this.cdr.detectChanges();
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], NotificationComponent.prototype, "notification", void 0);
    NotificationComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-notification',
            encapsulation: ViewEncapsulation.None,
            animations: [
                trigger('enterLeave', [
                    fadeInEnter, fadeInState, fadeOutLeave, fadeOutState,
                    fromBottomEnter, fromBottomInState, fromBottomLeave, fromBottomOutState,
                    fromRightEnter, fromRightInState, fromRightLeave, fromRightOutState,
                    fromLeftEnter, fromLeftInState, fromLeftLeave, fromLeftOutState,
                    fromTopEnter, fromTopInState, fromTopLeave, fromTopOutState,
                    rotateInState, rotateEnter, rotateOutState, rotateLeave,
                    scaleInState, scaleEnter, scaleOutState, scaleLeave
                ])
            ],
            templateUrl: './notification.component.html',
            styleUrls: ['./notification.component.scss'],
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        tslib_1.__metadata("design:paramtypes", [NotificationsService,
            DomSanitizer,
            ChangeDetectorRef,
            NgZone])
    ], NotificationComponent);
    return NotificationComponent;
}());
export { NotificationComponent };
//# sourceMappingURL=notification.component.js.map