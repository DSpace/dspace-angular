import {
  autoserialize,
  deserialize,
} from 'cerialize';

import { typedObject } from '../../cache/builders/build-decorators';
import { CacheableObject } from '../../cache/cacheable-object.model';
import { HALLink } from '../../shared/hal-link.model';
import { ResourceType } from '../../shared/resource-type';
import { excludeFromEquals } from '../../utilities/equals.decorators';

@typedObject
/**
 * Represents a correction type. It extends the CacheableObject.
 * The correction type represents a type of correction that can be applied to a submission.
 */
export class CorrectionType extends CacheableObject {
  static type = new ResourceType('correctiontype');

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;
  @autoserialize
  /**
   * The unique identifier for the correction type mode.
   */
    id: string;
  @autoserialize
  /**
   * The topic of the correction type mode.
   */
    topic: string;
  @autoserialize
  /**
   * The discovery configuration for the correction type mode.
   */
    discoveryConfiguration: string;
  @autoserialize
  /**
   * The form used for creating a correction type.
   */
    creationForm: string;
  @deserialize
  /**
   * Represents the links associated with the correction type mode.
   */
    _links: {
    self: HALLink;
  };
}
