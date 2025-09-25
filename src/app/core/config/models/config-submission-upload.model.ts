import {
  autoserialize,
  deserialize,
  inheritSerialization,
} from 'cerialize';
import { Observable } from 'rxjs';

import {
  link,
  typedObject,
} from '../../cache/builders/build-decorators';
import { RemoteData } from '../../data/remote-data';
import { HALLink } from '../../shared/hal-link.model';
import { ConfigObject } from './config.model';
import { AccessConditionOption } from './config-access-condition-option.model';
import { SubmissionFormsModel } from './config-submission-forms.model';
import {
  SUBMISSION_FORMS_TYPE,
  SUBMISSION_UPLOAD_TYPE,
} from './config-type';

@typedObject
@inheritSerialization(ConfigObject)
export class SubmissionUploadModel extends ConfigObject {
  static type =  SUBMISSION_UPLOAD_TYPE;
  /**
   * A list of available bitstream access conditions
   */
  @autoserialize
  accessConditionOptions: AccessConditionOption[];

  /**
   * An object representing the configuration describing the bitstream metadata form
   */
  @link(SUBMISSION_FORMS_TYPE)
  metadata?: Observable<RemoteData<SubmissionFormsModel>>;

  @autoserialize
  required: boolean;

  @autoserialize
  maxSize: number;

  @deserialize
  _links: {
    metadata: HALLink
    self: HALLink
  };

}
