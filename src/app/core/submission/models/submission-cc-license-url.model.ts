import {
  autoserialize,
  inheritSerialization,
} from 'cerialize';

import { typedObject } from '../../cache/builders/build-decorators';
import { HALResource } from '../../shared/hal-resource.model';
import { ResourceType } from '../../shared/resource-type';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { SUBMISSION_CC_LICENSE_URL } from './submission-cc-licence-link.resource-type';

@typedObject
@inheritSerialization(HALResource)
export class SubmissionCcLicenceUrl extends HALResource {

  static type = SUBMISSION_CC_LICENSE_URL;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  @autoserialize
  url: string;
}
