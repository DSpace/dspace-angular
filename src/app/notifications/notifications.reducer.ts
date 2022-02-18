import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import { notificationsBrokerTopicsReducer, NotificationsBrokerTopicState, } from './broker/topics/notifications-broker-topics.reducer';

/**
 * The OpenAIRE State
 */
export interface NotificationsState {
  'brokerTopic': NotificationsBrokerTopicState;
}

export const notificationsReducers: ActionReducerMap<NotificationsState> = {
  brokerTopic: notificationsBrokerTopicsReducer,
};

export const notificationsSelector = createFeatureSelector<NotificationsState>('notifications');
