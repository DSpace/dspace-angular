import { autoserialize, inheritSerialization } from 'cerialize';
import { NormalizedObject } from '../../cache/models/normalized-object.model';
import { CacheableObject, TypedObject } from '../../cache/object-cache.reducer';
import { ResourceType } from '../../shared/resource-type';

/**
 * Normalized abstract class for a configuration object
 */
@inheritSerialization(NormalizedObject)
export abstract class NormalizedConfigObject<T extends CacheableObject> implements CacheableObject {

  /**
   * The name for this configuration
   */
  @autoserialize
  public name: string;

  /**
   * The links to all related resources returned by the rest api.
   */
  @autoserialize
  public _links: {
    [name: string]: string
  };

  /**
   * The link to the rest endpoint where this config object can be found
   */
  @autoserialize
  self: string;

}
