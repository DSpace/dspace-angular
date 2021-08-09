import { URLCombiner } from '../../core/url-combiner/url-combiner';
import { getNotificationsModuleRoute } from '../admin-routing-paths';

export const NOTIFICATIONS_EDIT_PATH = 'openaire-broker';
export const NOTIFICATIONS_RECITER_SUGGESTION_PATH = 'suggestion-targets';

export function getNotificationsOpenairebrokerRoute(id: string) {
  return new URLCombiner(getNotificationsModuleRoute(), NOTIFICATIONS_EDIT_PATH, id).toString();
}
