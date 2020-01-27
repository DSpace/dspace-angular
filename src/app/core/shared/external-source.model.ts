import { CacheableObject } from '../cache/object-cache.reducer';
import { EXTERNAL_SOURCE } from './external-source.resource-type';
import { HALLink } from './hal-link.model';

/**
 * Model class for an external source
 */
export class ExternalSource extends CacheableObject {
  static type = EXTERNAL_SOURCE;

  /**
   * Unique identifier
   */
  id: string;

  /**
   * The name of this external source
   */
  name: string;

  /**
   * Is the source hierarchical?
   */
  hierarchical: boolean;

  /**
   * The link to the rest endpoint where this External Source can be found
   */
  self: string;

  _links: {
    self: HALLink;
    entries: HALLink;
  }
}
