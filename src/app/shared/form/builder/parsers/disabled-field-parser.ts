import { FormFieldMetadataValueObject } from '@dspace/core/shared/form/models/form-field-metadata-value.model';

import {
  DsDynamicDisabledModelConfig,
  DynamicDisabledModel,
} from '../ds-dynamic-form-ui/models/disabled/dynamic-disabled.model';
import { FieldParser } from './field-parser';

/**
 * Field parser for disabled fields
 */
export class DisabledFieldParser extends FieldParser {

  public modelFactory(fieldValue?: FormFieldMetadataValueObject, label?: boolean): any {
    const emptyModelConfig: DsDynamicDisabledModelConfig = this.initModel(null, label);
    this.setValues(emptyModelConfig, fieldValue, true);
    return new DynamicDisabledModel(emptyModelConfig);
  }
}
