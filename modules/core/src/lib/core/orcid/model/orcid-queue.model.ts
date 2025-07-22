import {
  autoserialize,
  deserialize,
} from 'cerialize';

import {
  CacheableObject,
  typedObject,
} from '../../cache';
import {
  HALLink,
  ResourceType,
} from '../../shared';
import { excludeFromEquals } from '../../utilities';
import { ORCID_QUEUE } from './orcid-queue.resource-type';

/**
 * Class the represents a Orcid Queue.
 */
@typedObject
export class OrcidQueue extends CacheableObject {

  static type = ORCID_QUEUE;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The identifier of this Orcid Queue record
   */
  @autoserialize
  id: number;

  /**
   * The record description.
   */
  @autoserialize
  description: string;

  /**
   * The identifier of the profileItem of this Orcid Queue record.
   */
  @autoserialize
  profileItemId: string;

  /**
   * The identifier of the entity related to this Orcid Queue record.
   */
  @autoserialize
  entityId: string;

  /**
   * The type of this Orcid Queue record.
   */
  @autoserialize
  recordType: string;

  /**
   * The operation related to this Orcid Queue record.
   */
  @autoserialize
  operation: string;

  /**
   * The {@link HALLink}s for this Orcid Queue record
   */
  @deserialize
  _links: {
    self: HALLink,
  };

}
