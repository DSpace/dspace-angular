import { autoserialize, autoserializeAs, deserialize } from 'cerialize';

import { typedObject } from '../../cache/builders/build-decorators';
import { CacheableObject } from '../../cache/cacheable-object.model';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { ResourceType } from '../../shared/resource-type';
import { HALLink } from '../../shared/hal-link.model';
import { MACHINE_TOKEN } from './machine-token.resource-type';

/**
 * A machine token that can be used to authenticate a rest request
 */
@typedObject
export class MachineToken implements CacheableObject {
  static type = MACHINE_TOKEN;
  /**
   * The type for this MachineToken
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The value for this MachineToken
   */
  @autoserializeAs('token')
  value: string;

  /**
   * The {@link HALLink}s for this MachineToken
   */
  @deserialize
  _links: {
    self: HALLink;
  };
}
