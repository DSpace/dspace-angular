import { createSelector, MemoizedSelector } from '@ngrx/store';
import { subStateSelector } from '../shared/selector.util';
import { notificationsSelector, NotificationsState } from './notifications.reducer';
import { NotificationsBrokerTopicObject } from '../core/notifications/broker/models/notifications-broker-topic.model';
import { NotificationsBrokerTopicState } from './broker/topics/notifications-broker-topics.reducer';
import { NotificationsBrokerSourceState } from './broker/source/notifications-broker-source.reducer';
import { NotificationsBrokerSourceObject } from '../core/notifications/broker/models/notifications-broker-source.model';

/**
 * Returns the Notifications state.
 * @function _getNotificationsState
 * @param {AppState} state Top level state.
 * @return {NotificationsState}
 */
const _getNotificationsState = (state: any) => state.notifications;

// Notifications Broker topics
// ----------------------------------------------------------------------------

/**
 * Returns the Notifications Broker topics State.
 * @function notificationsBrokerTopicsStateSelector
 * @return {NotificationsBrokerTopicState}
 */
export function notificationsBrokerTopicsStateSelector(): MemoizedSelector<NotificationsState, NotificationsBrokerTopicState> {
  return subStateSelector<NotificationsState,NotificationsBrokerTopicState>(notificationsSelector, 'brokerTopic');
}

/**
 * Returns the Notifications Broker topics list.
 * @function notificationsBrokerTopicsObjectSelector
 * @return {NotificationsBrokerTopicObject[]}
 */
export function notificationsBrokerTopicsObjectSelector(): MemoizedSelector<NotificationsState, NotificationsBrokerTopicObject[]> {
  return subStateSelector<NotificationsState, NotificationsBrokerTopicObject[]>(notificationsBrokerTopicsStateSelector(), 'topics');
}

/**
 * Returns true if the Notifications Broker topics are loaded.
 * @function isNotificationsBrokerTopicsLoadedSelector
 * @return {boolean}
 */
export const isNotificationsBrokerTopicsLoadedSelector = createSelector(_getNotificationsState,
  (state: NotificationsState) => state.brokerTopic.loaded
);

/**
 * Returns true if the deduplication sets are processing.
 * @function isDeduplicationSetsProcessingSelector
 * @return {boolean}
 */
export const isNotificationsBrokerTopicsProcessingSelector = createSelector(_getNotificationsState,
  (state: NotificationsState) => state.brokerTopic.processing
);

/**
 * Returns the total available pages of Notifications Broker topics.
 * @function getNotificationsBrokerTopicsTotalPagesSelector
 * @return {number}
 */
export const getNotificationsBrokerTopicsTotalPagesSelector = createSelector(_getNotificationsState,
  (state: NotificationsState) => state.brokerTopic.totalPages
);

/**
 * Returns the current page of Notifications Broker topics.
 * @function getNotificationsBrokerTopicsCurrentPageSelector
 * @return {number}
 */
export const getNotificationsBrokerTopicsCurrentPageSelector = createSelector(_getNotificationsState,
  (state: NotificationsState) => state.brokerTopic.currentPage
);

/**
 * Returns the total number of Notifications Broker topics.
 * @function getNotificationsBrokerTopicsTotalsSelector
 * @return {number}
 */
export const getNotificationsBrokerTopicsTotalsSelector = createSelector(_getNotificationsState,
  (state: NotificationsState) => state.brokerTopic.totalElements
);

// Notifications Broker source
// ----------------------------------------------------------------------------

/**
 * Returns the Notifications Broker source State.
 * @function notificationsBrokerSourceStateSelector
 * @return {NotificationsBrokerSourceState}
 */
 export function notificationsBrokerSourceStateSelector(): MemoizedSelector<NotificationsState, NotificationsBrokerSourceState> {
  return subStateSelector<NotificationsState,NotificationsBrokerSourceState>(notificationsSelector, 'brokerSource');
}

/**
 * Returns the Notifications Broker source list.
 * @function notificationsBrokerSourceObjectSelector
 * @return {NotificationsBrokerSourceObject[]}
 */
export function notificationsBrokerSourceObjectSelector(): MemoizedSelector<NotificationsState, NotificationsBrokerSourceObject[]> {
  return subStateSelector<NotificationsState, NotificationsBrokerSourceObject[]>(notificationsBrokerSourceStateSelector(), 'source');
}

/**
 * Returns true if the Notifications Broker source are loaded.
 * @function isNotificationsBrokerSourceLoadedSelector
 * @return {boolean}
 */
export const isNotificationsBrokerSourceLoadedSelector = createSelector(_getNotificationsState,
  (state: NotificationsState) => state.brokerSource.loaded
);

/**
 * Returns true if the deduplication sets are processing.
 * @function isDeduplicationSetsProcessingSelector
 * @return {boolean}
 */
export const isNotificationsBrokerSourceProcessingSelector = createSelector(_getNotificationsState,
  (state: NotificationsState) => state.brokerSource.processing
);

/**
 * Returns the total available pages of Notifications Broker source.
 * @function getNotificationsBrokerSourceTotalPagesSelector
 * @return {number}
 */
export const getNotificationsBrokerSourceTotalPagesSelector = createSelector(_getNotificationsState,
  (state: NotificationsState) => state.brokerSource.totalPages
);

/**
 * Returns the current page of Notifications Broker source.
 * @function getNotificationsBrokerSourceCurrentPageSelector
 * @return {number}
 */
export const getNotificationsBrokerSourceCurrentPageSelector = createSelector(_getNotificationsState,
  (state: NotificationsState) => state.brokerSource.currentPage
);

/**
 * Returns the total number of Notifications Broker source.
 * @function getNotificationsBrokerSourceTotalsSelector
 * @return {number}
 */
export const getNotificationsBrokerSourceTotalsSelector = createSelector(_getNotificationsState,
  (state: NotificationsState) => state.brokerSource.totalElements
);
