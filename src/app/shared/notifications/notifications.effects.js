import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
var NotificationsEffects = /** @class */ (function () {
    /**
     * Authenticate user.
     * @method authenticate
     */
    /* @Effect()
     public timer: Observable<Action> = this.actions$
       .pipe(ofType(NotificationsActionTypes.NEW_NOTIFICATION_WITH_TIMER),
       // .debounceTime((action: any) => action.payload.options.timeOut)
       debounceTime(3000),
       map(() => new RemoveNotificationAction());
        .switchMap((action: NewNotificationWithTimerAction) => Observable
         .timer(30000)
         .mapTo(() => new RemoveNotificationAction())
       ));*/
    /**
     * @constructor
     * @param {Actions} actions$
     * @param {Store} store
     */
    function NotificationsEffects(actions$, store) {
        this.actions$ = actions$;
        this.store = store;
    }
    NotificationsEffects = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Actions,
            Store])
    ], NotificationsEffects);
    return NotificationsEffects;
}());
export { NotificationsEffects };
//# sourceMappingURL=notifications.effects.js.map