import { URLCombiner } from '../../core/url-combiner/url-combiner';
import { getNotificationsModuleRoute } from '../admin-routing-paths';

export const NOTIFICATIONS_EDIT_PATH = 'notifications-broker';

export function getNotificationsBrokerbrokerRoute(id: string) {
  return new URLCombiner(getNotificationsModuleRoute(), NOTIFICATIONS_EDIT_PATH, id).toString();
}
