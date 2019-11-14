import { FieldParser } from './field-parser';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { DsDynamicInputModel, DsDynamicInputModelConfig } from '../ds-dynamic-form-ui/models/ds-dynamic-input.model';

/**
 * A parser for number field.
 */
export class NumberFieldParser extends FieldParser {

  /**
   * Return field model instance
   *
   * @param fieldValue
   *    The eventually filed value
   * @param label
   *    Flag to hide field label from model
   * @return any
   *    field model instance
   */
  public modelFactory(fieldValue?: FormFieldMetadataValueObject | any, label?: boolean): any {
    const numberModelConfig: DsDynamicInputModelConfig = this.initModel(null, label);

    this.setValues(numberModelConfig, fieldValue);
    numberModelConfig.inputType = 'number';
    numberModelConfig.min = 0;
    return new DsDynamicInputModel(numberModelConfig);
  }
}
