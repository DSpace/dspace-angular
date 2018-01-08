import { uniqueId } from 'lodash';

import { FieldParser } from './field-parser';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { FormFieldModel } from '../models/form-field.model';
import {
  DynamicGroupModel,
  DynamicGroupModelConfig
} from '../ds-dynamic-form-ui/models/ds-dynamic-group/dynamic-group.model';
import {isNotEmpty} from '../../../empty.util';

export class GroupFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel, protected initFormValues) {
    super(configData, initFormValues);
  }

  public modelFactory(fieldValue: FormFieldMetadataValueObject) {
    const modelId = uniqueId('group-field-');
    const modelConfiguration: DynamicGroupModelConfig = this.initModel(modelId);
    const model: DynamicGroupModel = new DynamicGroupModel(modelConfiguration);

    if (this.configData && this.configData.rows && this.configData.rows.length > 0) {
      model.formConfiguration = this.configData.rows;
      if(this.configData.selectableMetadata[0] && this.configData.selectableMetadata[0].metadata) {
        model.mandatoryField = this.configData.selectableMetadata[0].metadata;
      }
    } else {
      throw new Error(`Configuration not valid: ${model.name}`);
    }

    if (isNotEmpty(this.getInitGroupValues())) {
      model.storedValue = this.getInitGroupValues();
    }

    return model;
  }

}
