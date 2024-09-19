import {
  autoserialize,
  autoserializeAs,
  deserialize,
} from 'cerialize';

import { typedObject } from '../cache/builders/build-decorators';
import { CacheableObject } from '../cache/cacheable-object.model';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { CONFIG_PROPERTY } from './config-property.resource-type';
import { HALLink } from './hal-link.model';
import { ResourceType } from './resource-type';

/**
 * Model class for a Configuration Property
 */
@typedObject
export class ConfigurationProperty implements CacheableObject {
  static type = CONFIG_PROPERTY;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The uuid of the configuration property
   * The name is used as id for configuration properties
   */
  @autoserializeAs(String, 'name')
  uuid: string;

  /**
   * The name of the configuration property
   */
  @autoserialize
  name: string;

  /**
   * The values of the configuration property
   */
  @autoserialize
  values: string[];

  /**
   * The links of the configuration property
   */
  @deserialize
  _links: { self: HALLink };

}
