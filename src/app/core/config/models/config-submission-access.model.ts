import { autoserialize, inheritSerialization, deserialize } from 'cerialize';
import { typedObject, link } from '../../cache/builders/build-decorators';
import { ConfigObject } from './config.model';
import { AccessesConditionOption } from './config-accesses-conditions-options.model';
import { SUBMISSION_ACCESSES_TYPE } from './config-type';
import { HALLink } from '../../shared/hal-link.model';


@typedObject
@inheritSerialization(ConfigObject)
export class SubmissionAccessModel extends ConfigObject {
  static type = SUBMISSION_ACCESSES_TYPE;
  /**
   * A list of available bitstream access conditions
   */
  @autoserialize
  accessConditionOptions: AccessesConditionOption[];

  @autoserialize
  discoverable: boolean;

  @autoserialize
  canChangeDiscoverable: boolean;

  @deserialize
  _links: {
    self: HALLink
  };

}
