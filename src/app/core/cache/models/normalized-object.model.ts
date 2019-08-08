import { CacheableObject, TypedObject } from '../object-cache.reducer';
import { autoserialize } from 'cerialize';
import { ResourceType } from '../../shared/resource-type';
/**
 * An abstract model class for a NormalizedObject.
 */
export abstract class NormalizedObject<T extends TypedObject> implements CacheableObject {
  /**
   * The link to the rest endpoint where this object can be found
   */
  @autoserialize
  self: string;

  @autoserialize
  _links: {
    [name: string]: string
  };

  /**
   * A string representing the kind of object
   */
  @autoserialize
  type: string;
}
