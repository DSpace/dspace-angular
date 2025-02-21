import {
  autoserialize,
  autoserializeAs,
  inheritSerialization,
} from 'cerialize';

import { typedObject } from '../../cache';
import { HALLink } from '../../shared';
import { ResourceType } from '../../shared';
import { excludeFromEquals } from '../../utilities';
import { ConfigObject } from './config.model';
import { AccessesConditionOption } from './config-accesses-conditions-options.model';
import { BULK_ACCESS_CONDITION_OPTIONS } from './config-type';

/**
 * Model class for a bulk access condition options
 */
@typedObject
@inheritSerialization(ConfigObject)
export class BulkAccessConditionOptions extends ConfigObject {
  static type = BULK_ACCESS_CONDITION_OPTIONS;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  @autoserializeAs(String, 'name')
  uuid: string;

  @autoserialize
  id: string;

  @autoserialize
  itemAccessConditionOptions: AccessesConditionOption[];

  @autoserialize
  bitstreamAccessConditionOptions: AccessesConditionOption[];

  _links: { self: HALLink };
}
