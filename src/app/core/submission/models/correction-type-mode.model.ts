import { autoserialize, deserialize } from 'cerialize';
import { typedObject } from '../../cache/builders/build-decorators';
import { CacheableObject } from '../../cache/cacheable-object.model';
import { ResourceType } from '../../shared/resource-type';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { HALLink } from '../../shared/hal-link.model';

@typedObject
export class CorrectionTypeMode extends CacheableObject {
  static type = new ResourceType('correctiontype');

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  @autoserialize
  id: string;

  @autoserialize
  topic: string;

  @autoserialize
  discoveryConfiguration: string;

  @autoserialize
  creationForm: string;

  @deserialize
  _links: {
    self: HALLink;
  };
}
