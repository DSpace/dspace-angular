import { autoserialize } from 'cerialize';
import { LanguageCode } from './form-field-language-value.model';
import { FormFieldMetadataValueObject } from './form-field-metadata-value.model';
import { FormRowModel } from '../../../../core/config/models/config-submission-form.model';

export class FormFieldModel {

  @autoserialize
  hints: string;

  @autoserialize
  label: string;

  @autoserialize
  languageCodes: LanguageCode[];

  @autoserialize
  mandatoryMessage: string;

  @autoserialize
  mandatory: string;

  @autoserialize
  repeatable: boolean;

  @autoserialize
  input: {
    type: string;
    regex?: string;
  };

  @autoserialize
  selectableMetadata: FormFieldMetadataValueObject[];

  @autoserialize
  rows: FormRowModel[];

  @autoserialize
  scope: string;

  @autoserialize
  style: string;

  @autoserialize
  value: any;
}
