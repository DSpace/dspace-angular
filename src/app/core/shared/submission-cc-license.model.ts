import { autoserialize, inheritSerialization } from 'cerialize';
import { typedObject } from '../cache/builders/build-decorators';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { ResourceType } from './resource-type';
import { HALResource } from './hal-resource.model';
import { SUBMISSION_CC_LICENSE } from './submission-cc-licences.resource-type';

@typedObject
@inheritSerialization(HALResource)
export class SubmissionCcLicence extends HALResource {

  static type = SUBMISSION_CC_LICENSE;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  @autoserialize
  name: string;

  @autoserialize
  fields: Array<{
    id: string;
    label: string;
    description: string;
    enums: Array<{
      id: string;
      label: string;
      description: string;
    }>;
  }>;
}
