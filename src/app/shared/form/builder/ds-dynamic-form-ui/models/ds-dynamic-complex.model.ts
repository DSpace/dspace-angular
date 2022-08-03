import { DynamicFormControlLayout } from '@ng-dynamic-forms/core';

import { hasNoValue, hasValue, isNotEmpty } from '../../../../empty.util';
import { DsDynamicInputModel } from './ds-dynamic-input.model';
import { FormFieldMetadataValueObject } from '../../models/form-field-metadata-value.model';
import { DynamicConcatModel, DynamicConcatModelConfig } from './ds-dynamic-concat.model';
import { AUTOCOMPLETE_COMPLEX_PREFIX } from './autocomplete/ds-dynamic-autocomplete.model';
import { DsDynamicAutocompleteService } from './autocomplete/ds-dynamic-autocomplete.service';

export const COMPLEX_GROUP_SUFFIX = '_COMPLEX_GROUP';
export const COMPLEX_INPUT_SUFFIX = '_COMPLEX_INPUT_';
export const SEPARATOR = ';';
export const SPONSOR_METADATA_NAME = 'local.sponsor';
export const EU_PROJECT_PREFIX = 'info:eu-repo';
export const OPENAIRE_INPUT_NAME = 'openaire_id';

/**
 * Configuration for the DynamicComplexModel.
 */
export interface DynamicComplexModelConfig extends DynamicConcatModelConfig {}

/**
 * The model for the Complex input field which consist of multiple input fields.
 */
export class DynamicComplexModel extends DynamicConcatModel {

  constructor(config: DynamicComplexModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.separator = SEPARATOR;
  }

  get value() {
    const formValues = this.group.map((inputModel: DsDynamicInputModel) =>
      (typeof inputModel.value === 'string') ?
        Object.assign(new FormFieldMetadataValueObject(), { value: inputModel.value, display: inputModel.value }) :
        (inputModel.value as any));

    let value = '';
    let allFormValuesEmpty = true;

    formValues.forEach((formValue, index) => {
      if (isNotEmpty(formValue) && isNotEmpty(formValue.value)) {
        value += formValue.value + this.separator;
        allFormValuesEmpty = false;
      } else {
        value += this.separator;
      }
    });
    // remove last separator in the end of the value
    value = value.slice(0, -1);

    // `local.sponsor` input type has input value stored in one input field which starts with AUTOCOMPLETE_COMPLEX_PREFIX
    if (this.name === SPONSOR_METADATA_NAME) {
      formValues.forEach((formValue) => {
        if (isNotEmpty(formValue) && isNotEmpty(formValue.value) &&
          formValue.value.startsWith(AUTOCOMPLETE_COMPLEX_PREFIX)) {
          // remove AUTOCOMPLETE_COMPLEX_PREFIX from the value because it cannot be in the metadata value
          value = DsDynamicAutocompleteService.removeAutocompletePrefix(formValue);
        }
      });
    }
    // set value as empty string otherwise value will be e.g. `;;;;` and it throws error
    if (allFormValuesEmpty) {
      value = '';
    }
     if (isNotEmpty(formValues)) {
      return Object.assign(new FormFieldMetadataValueObject(),{ value: value });
    }
    return null;

  }

  set value(value: string | FormFieldMetadataValueObject) {
    let values;
    let tempValue: string;

    if (typeof value === 'string') {
      tempValue = value;
    } else {
      tempValue = value.value;
    }
    if (hasNoValue(tempValue)) {
      tempValue = '';
    }
    values = [...tempValue.split(this.separator), null].map((v) => {
        return Object.assign(new FormFieldMetadataValueObject(), value, { display: v, value: v });
    });

    // remove undefined values
    values = values.filter(v => v);

    values.forEach((val, index) =>  {
      if (val.value) {
        (this.get(index) as DsDynamicInputModel).value = val;
        // local.sponsor input type on the 4 index should be hidden if is empty or without EU_PROJECT_PREFIX
        if (this.name === SPONSOR_METADATA_NAME && index === 4) {
          if (val.value.includes(EU_PROJECT_PREFIX)) {
            (this.get(index) as DsDynamicInputModel).hidden = false;
          } else {
            (this.get(index) as DsDynamicInputModel).hidden = true;
          }
        }
      } else if (hasValue((this.get(index) as DsDynamicInputModel))) {
        (this.get(index) as DsDynamicInputModel).value = undefined;
      }
    });
  }
}
