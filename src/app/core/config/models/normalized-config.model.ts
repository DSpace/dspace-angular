import { autoserialize, inheritSerialization } from 'cerialize';
import { NormalizedObject } from '../../cache/models/normalized-object.model';
import { CacheableObject } from '../../cache/object-cache.reducer';
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
   * A string representing the kind of config object
   */
  @autoserialize
  public type: ResourceType;

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
