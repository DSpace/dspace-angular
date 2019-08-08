import { CacheableObject } from '../../cache/object-cache.reducer';
import { ResourceType } from '../../shared/resource-type';

export abstract class ConfigObject implements CacheableObject {

  /**
   * The name for this configuration
   */
  public name: string;

  /**
   * The links to all related resources returned by the rest api.
   */
  public _links: {
    [name: string]: string
  };

  /**
   * The link to the rest endpoint where this config object can be found
   */
  self: string;
}
