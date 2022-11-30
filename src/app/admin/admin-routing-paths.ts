import { URLCombiner } from '../core/url-combiner/url-combiner';
import { getAdminModuleRoute } from '../app-routing-paths';

export const REGISTRIES_MODULE_PATH = 'registries';

export function getRegistriesModuleRoute() {
  return new URLCombiner(getAdminModuleRoute(), REGISTRIES_MODULE_PATH).toString();
}

export const REPORTS_MODULE_PATH = 'reports';

export function getReportsModuleRoute() {
  return new URLCombiner(getAdminModuleRoute(), REPORTS_MODULE_PATH).toString();
}
