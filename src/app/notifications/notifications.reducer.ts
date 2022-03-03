import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { notificationsBrokerSourceReducer, NotificationsBrokerSourceState } from './broker/source/notifications-broker-source.reducer';
import { notificationsBrokerTopicsReducer, NotificationsBrokerTopicState, } from './broker/topics/notifications-broker-topics.reducer';

/**
 * The OpenAIRE State
 */
export interface NotificationsState {
  'brokerTopic': NotificationsBrokerTopicState;
  'brokerSource': NotificationsBrokerSourceState;
}

export const notificationsReducers: ActionReducerMap<NotificationsState> = {
  brokerTopic: notificationsBrokerTopicsReducer,
  brokerSource: notificationsBrokerSourceReducer
};

export const notificationsSelector = createFeatureSelector<NotificationsState>('notifications');
