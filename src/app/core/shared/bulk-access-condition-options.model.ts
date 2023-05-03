import { autoserialize, autoserializeAs, deserialize } from 'cerialize';
import { typedObject } from '../cache/builders/build-decorators';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { ResourceType } from './resource-type';
import { CacheableObject } from '../cache/cacheable-object.model';
import { HALLink } from './hal-link.model';

export const BULK_ACCESS_CONDITION_OPTIONS = new ResourceType('bulkAccessConditionOptions');

/**
 * Model class for a bulk access condition options
 */
@typedObject
export class BulkAccessConditionOptions implements CacheableObject {
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

  @deserialize
  itemAccessConditionOptions: AccessControlItem[];

  @deserialize
  bitstreamAccessConditionOptions: AccessControlItem[];

  _links: { self: HALLink };
}

export interface AccessControlItem {
  name: string
  hasStartDate?: boolean
  maxStartDate?: string
  hasEndDate?: boolean
  maxEndDate?: string
}
