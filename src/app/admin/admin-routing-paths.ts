import { getAdminModuleRoute } from '../app-routing-paths';
import { URLCombiner } from '../core/url-combiner/url-combiner';

export const REGISTRIES_MODULE_PATH = 'registries';

export function getRegistriesModuleRoute() {
  return new URLCombiner(getAdminModuleRoute(), REGISTRIES_MODULE_PATH).toString();
}
