import { autoserialize, inheritSerialization } from 'cerialize';
import { typedObject } from '../../cache/builders/build-decorators';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { ResourceType } from '../../shared/resource-type';
import { HALResource } from '../../shared/hal-resource.model';
import { SUBMISSION_CUSTOM_URL } from './submission-custom-url.resource-type';

@typedObject
@inheritSerialization(HALResource)
export class SubmissionCustomUrl extends HALResource {

  static type = SUBMISSION_CUSTOM_URL;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  @autoserialize
  url: string;
}
