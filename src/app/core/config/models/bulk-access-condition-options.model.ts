import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { typedObject } from '../../cache/builders/build-decorators';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { ResourceType } from '../../shared/resource-type';
import { HALLink } from '../../shared/hal-link.model';
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
