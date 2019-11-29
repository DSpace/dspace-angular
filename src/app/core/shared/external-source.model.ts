import { ResourceType } from './resource-type';
import { CacheableObject } from '../cache/object-cache.reducer';

/**
 * Model class for an external source
 */
export class ExternalSource extends CacheableObject {
  static type = new ResourceType('externalsource');

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
}
