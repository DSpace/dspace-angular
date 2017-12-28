import { uniqueId } from 'lodash';

import { FieldParser } from './field-parser';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { FormFieldModel } from '../models/form-field.model';
import {
  DynamicGroupModel,
  DynamicGroupModelConfig
} from '../ds-dynamic-form-ui/models/ds-dynamic-group/dynamic-group.model';

export class GroupFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel, protected initFormValues) {
    super(configData, initFormValues);
  }

  public modelFactory(fieldValue: FormFieldMetadataValueObject) {
    const modelId = uniqueId('group-field-');
    const modelConfiguration: DynamicGroupModelConfig = this.initModel(modelId);
    const model: DynamicGroupModel = new DynamicGroupModel(modelConfiguration);

    return model;
  }

}
