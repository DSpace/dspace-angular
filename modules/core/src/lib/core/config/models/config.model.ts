import {
  autoserialize,
  deserialize,
} from 'cerialize';

import { CacheableObject } from '../../cache';
import {
  HALLink,
  ResourceType,
} from '../../shared';
import { excludeFromEquals } from '../../utilities';

export abstract class ConfigObject implements CacheableObject {

  /**
   * The name for this configuration
   */
  @autoserialize
  public id: string;

  /**
   * The name for this configuration
   */
  @autoserialize
  public name: string;

  /**
   * The type of this ConfigObject
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The links to all related resources returned by the rest api.
   */
  @deserialize
  _links: {
    self: HALLink,
    [name: string]: HALLink
  };
}
