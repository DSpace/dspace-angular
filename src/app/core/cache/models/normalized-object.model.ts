import { CacheableObject } from '../object-cache.reducer';
import { autoserialize } from 'cerialize';
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

}
