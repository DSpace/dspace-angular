import { URLCombiner } from '../core/url-combiner/url-combiner';
import { getAdminModuleRoute } from '../app-routing-paths';
import { getQualityAssuranceEditRoute } from '../quality-assurance-notifications-pages/notifications-pages-routing-paths';

export const REGISTRIES_MODULE_PATH = 'registries';
export const NOTIFICATIONS_MODULE_PATH = 'notifications';

export const NOTIFY_DASHBOARD_MODULE_PATH = 'notify-dashboard';

export const LDN_PATH = 'ldn';

export function getRegistriesModuleRoute() {
  return new URLCombiner(getAdminModuleRoute(), REGISTRIES_MODULE_PATH).toString();
}

export function getLdnServicesModuleRoute() {
  return new URLCombiner(getAdminModuleRoute(), LDN_PATH).toString();
}

export function getNotificatioQualityAssuranceRoute() {
  return new URLCombiner(`/${NOTIFICATIONS_MODULE_PATH}`, getQualityAssuranceEditRoute()).toString();
}
