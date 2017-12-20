import { autoserialize, inheritSerialization } from 'cerialize';
import { ConfigObject } from './config.model';
import { FormFieldModel } from '../../../shared/form/builder/models/form-field.model';

interface FormRowModel {
  fields: FormFieldModel[];
}

@inheritSerialization(ConfigObject)
export class SubmissionFormsModel extends ConfigObject {

  @autoserialize
  rows: FormRowModel[];
}
