import { NotificationsBrokerSourceEffects } from './broker/source/notifications-broker-source.effects';
import { NotificationsBrokerTopicsEffects } from './broker/topics/notifications-broker-topics.effects';

export const notificationsEffects = [
  NotificationsBrokerTopicsEffects,
  NotificationsBrokerSourceEffects
];
