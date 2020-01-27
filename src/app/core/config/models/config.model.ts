import { CacheableObject } from '../../cache/object-cache.reducer';
import { HALLink } from '../../shared/hal-link.model';

export abstract class ConfigObject implements CacheableObject {

  /**
   * The name for this configuration
   */
  public name: string;

  /**
   * The links to all related resources returned by the rest api.
   */
  _links: {
    self: HALLink,
    [name: string]: HALLink
  };

  /**
   * The link to the rest endpoint where this config object can be found
   */
  self: string;
}
