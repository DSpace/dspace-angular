import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ObjectUpdatesActionTypes, RemoveObjectUpdatesAction } from './object-updates.actions';
import { delay, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { of as observableOf, race as observableRace, Subject } from 'rxjs';
import { hasNoValue } from '../../../shared/empty.util';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { NotificationsActionTypes } from '../../../shared/notifications/notifications.actions';
/**
 * NGRX effects for ObjectUpdatesActions
 */
var ObjectUpdatesEffects = /** @class */ (function () {
    function ObjectUpdatesEffects(actions$, notificationsService) {
        var _this = this;
        this.actions$ = actions$;
        this.notificationsService = notificationsService;
        /**
         * Identifier for when an action on all notifications is performed
         */
        this.allIdentifier = 'all';
        /**
         * Map that keeps track of the latest ObjectUpdatesAction for each page's url
         */
        this.actionMap$ = {};
        this.notificationActionMap$ = { all: new Subject() };
        /**
         * Effect that makes sure all last fired ObjectUpdatesActions are stored in the map of this service, with the url as their key
         */
        this.mapLastActions$ = this.actions$
            .pipe(ofType.apply(void 0, Object.values(ObjectUpdatesActionTypes)), map(function (action) {
            var url = action.payload.url;
            if (hasNoValue(_this.actionMap$[url])) {
                _this.actionMap$[url] = new Subject();
            }
            _this.actionMap$[url].next(action);
        }));
        /**
         * Effect that makes sure all last fired NotificationActions are stored in the notification map of this service, with the id as their key
         */
        this.mapLastNotificationActions$ = this.actions$
            .pipe(ofType.apply(void 0, Object.values(NotificationsActionTypes)), map(function (action) {
            var id = action.payload.id || action.payload || _this.allIdentifier;
            if (hasNoValue(_this.notificationActionMap$[id])) {
                _this.notificationActionMap$[id] = new Subject();
            }
            _this.notificationActionMap$[id].next(action);
        }));
        /**
         * Effect that checks whether the removeAction's notification timeout ends before a user triggers another ObjectUpdatesAction
         * When no ObjectUpdatesAction is fired during the timeout, a RemoteObjectUpdatesAction will be returned
         * When a REINSTATE action is fired during the timeout, a NO_ACTION action will be returned
         * When any other ObjectUpdatesAction is fired during the timeout, a RemoteObjectUpdatesAction will be returned
         */
        this.removeAfterDiscardOrReinstateOnUndo$ = this.actions$
            .pipe(ofType(ObjectUpdatesActionTypes.DISCARD), switchMap(function (action) {
            var url = action.payload.url;
            var notification = action.payload.notification;
            var timeOut = notification.options.timeOut;
            return observableRace(
            // Either wait for the delay and perform a remove action
            observableOf(new RemoveObjectUpdatesAction(action.payload.url)).pipe(delay(timeOut)), 
            // Or wait for a a user action
            _this.actionMap$[url].pipe(take(1), tap(function () {
                _this.notificationsService.remove(notification);
            }), map(function (updateAction) {
                if (updateAction.type === ObjectUpdatesActionTypes.REINSTATE) {
                    // If someone reinstated, do nothing, just let the reinstating happen
                    return { type: 'NO_ACTION' };
                }
                // If someone performed another action, assume the user does not want to reinstate and remove all changes
                return new RemoveObjectUpdatesAction(action.payload.url);
            })), _this.notificationActionMap$[notification.id].pipe(filter(function (notificationsAction) { return notificationsAction.type === NotificationsActionTypes.REMOVE_NOTIFICATION; }), map(function () {
                return new RemoveObjectUpdatesAction(action.payload.url);
            })), _this.notificationActionMap$[_this.allIdentifier].pipe(filter(function (notificationsAction) { return notificationsAction.type === NotificationsActionTypes.REMOVE_ALL_NOTIFICATIONS; }), map(function () {
                return new RemoveObjectUpdatesAction(action.payload.url);
            })));
        }));
    }
    tslib_1.__decorate([
        Effect({ dispatch: false }),
        tslib_1.__metadata("design:type", Object)
    ], ObjectUpdatesEffects.prototype, "mapLastActions$", void 0);
    tslib_1.__decorate([
        Effect({ dispatch: false }),
        tslib_1.__metadata("design:type", Object)
    ], ObjectUpdatesEffects.prototype, "mapLastNotificationActions$", void 0);
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Object)
    ], ObjectUpdatesEffects.prototype, "removeAfterDiscardOrReinstateOnUndo$", void 0);
    ObjectUpdatesEffects = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Actions,
            NotificationsService])
    ], ObjectUpdatesEffects);
    return ObjectUpdatesEffects;
}());
export { ObjectUpdatesEffects };
//# sourceMappingURL=object-updates.effects.js.map