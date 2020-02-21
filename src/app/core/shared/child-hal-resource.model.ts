import { HALResource } from './hal-resource.model';

export interface ChildHALResource extends HALResource {
  getParentLinkKey(): keyof this['_links'];
}
