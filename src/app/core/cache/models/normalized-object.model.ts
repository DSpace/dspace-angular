import { autoserialize } from 'cerialize';

import { ResourceType } from '../../shared/resource-type';
import { CacheableObject } from '../object-cache.reducer';

/**
 * An abstract model class for a NormalizedObject.
 */
export abstract class NormalizedObject implements CacheableObject {

  /**
   * The link to the rest endpoint where this object can be found
   */
  @autoserialize
  self: string;

  /**
   * The universally unique identifier of this Object
   */
  @autoserialize
  uuid: string;

  @autoserialize
  type: ResourceType;

  @autoserialize
  _links: {
    [name: string]: string
  }
}
