import {autoserialize, autoserializeAs, inheritSerialization} from 'cerialize';
import { ConfigObject } from './config.model';
import { AccessConditionOption } from './config-access-condition-option.model';
import {SubmissionFormsModel} from './config-submission-forms.model';

@inheritSerialization(ConfigObject)
export class SubmissionUploadsModel extends ConfigObject {

  @autoserialize
  accessConditionOptions: AccessConditionOption[];

  @autoserializeAs(SubmissionFormsModel)
  metadata: SubmissionFormsModel[];

  @autoserialize
  required: boolean;

  @autoserialize
  maxSize: number;

}
