import { NotificationsActionTypes } from './notifications.actions';
/**
 * The initial state.
 */
var initialState = [];
/**
 * The reducer function.
 * @function reducer
 * @param {State} state Current state
 * @param {NotificationsActions} action Incoming action
 */
export function notificationsReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case NotificationsActionTypes.NEW_NOTIFICATION:
            return state.concat([action.payload]);
        case NotificationsActionTypes.REMOVE_ALL_NOTIFICATIONS:
            return [];
        case NotificationsActionTypes.REMOVE_NOTIFICATION:
            return removeNotification(state, action);
        default:
            return state;
    }
}
var removeNotification = function (state, action) {
    return state.filter(function (item) { return item.id !== action.payload; });
};
//# sourceMappingURL=notifications.reducers.js.map