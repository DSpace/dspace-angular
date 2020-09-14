import { CacheableObject } from '../../cache/object-cache.reducer';
import { typedObject } from '../../cache/builders/build-decorators';
import { ORCID_QUEUE } from './orcid-queue.resource-type';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { autoserialize, deserialize } from 'cerialize';
import { ResourceType } from '../../shared/resource-type';
import { HALLink } from '../../shared/hal-link.model';

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
   * The name of the related entity
   */
  @autoserialize
  entityName: string;

  /**
   * The identifier of the owner of this Orcid Queue record.
   */
  @autoserialize
  ownerId: string;

  /**
   * The identifier of the entity related to this Orcid Queue record.
   */
  @autoserialize
  entityId: string;

  /**
   * The type of the entity related to this Orcid Queue record.
   */
  @autoserialize
  entityType: string;

  /**
   * The {@link HALLink}s for this Orcid Queue record
   */
  @deserialize
  _links: {
    self: HALLink,
  };

}
