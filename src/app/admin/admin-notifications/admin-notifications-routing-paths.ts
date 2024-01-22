import { URLCombiner } from '../../core/url-combiner/url-combiner';
import { getNotificationsModuleRoute } from '../admin-routing-paths';

export const QUALITY_ASSURANCE_EDIT_PATH = 'quality-assurance';

export function getQualityAssuranceRoute(id: string) {
  return new URLCombiner(getNotificationsModuleRoute(), QUALITY_ASSURANCE_EDIT_PATH, id).toString();
}
