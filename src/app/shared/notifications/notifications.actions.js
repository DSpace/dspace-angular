import { type } from '../../shared/ngrx/type';
export var NotificationsActionTypes = {
    NEW_NOTIFICATION: type('dspace/notifications/NEW_NOTIFICATION'),
    REMOVE_ALL_NOTIFICATIONS: type('dspace/notifications/REMOVE_ALL_NOTIFICATIONS'),
    REMOVE_NOTIFICATION: type('dspace/notifications/REMOVE_NOTIFICATION'),
};
/* tslint:disable:max-classes-per-file */
/**
 * New notification.
 * @class NewNotificationAction
 * @implements {Action}
 */
var NewNotificationAction = /** @class */ (function () {
    function NewNotificationAction(notification) {
        this.type = NotificationsActionTypes.NEW_NOTIFICATION;
        this.payload = notification;
    }
    return NewNotificationAction;
}());
export { NewNotificationAction };
/**
 * Remove all notifications.
 * @class RemoveAllNotificationsAction
 * @implements {Action}
 */
var RemoveAllNotificationsAction = /** @class */ (function () {
    function RemoveAllNotificationsAction(payload) {
        this.payload = payload;
        this.type = NotificationsActionTypes.REMOVE_ALL_NOTIFICATIONS;
    }
    return RemoveAllNotificationsAction;
}());
export { RemoveAllNotificationsAction };
/**
 * Remove a notification.
 * @class RemoveNotificationAction
 * @implements {Action}
 */
var RemoveNotificationAction = /** @class */ (function () {
    function RemoveNotificationAction(notificationId) {
        this.type = NotificationsActionTypes.REMOVE_NOTIFICATION;
        this.payload = notificationId;
    }
    return RemoveNotificationAction;
}());
export { RemoveNotificationAction };
//# sourceMappingURL=notifications.actions.js.map