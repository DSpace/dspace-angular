import {
  autoserialize,
  inheritSerialization,
} from 'cerialize';

import { typedObject } from '../../cache';
import { HALResource } from '../../shared';
import { ResourceType } from '../../shared';
import { excludeFromEquals } from '../../utilities';
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
