import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { ConfigObject } from './config.model';
import { FormFieldModel } from '../../../shared/form/builder/models/form-field.model';

@inheritSerialization(ConfigObject)
export class SubmissionFormsModel extends ConfigObject {

  @autoserializeAs(FormFieldModel)
  fields: FormFieldModel[];

}
