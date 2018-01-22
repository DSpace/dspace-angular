import { uniqueId } from 'lodash';

import { FieldParser } from './field-parser';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { FormFieldModel } from '../models/form-field.model';
import {
  DynamicGroupModel,
  DynamicGroupModelConfig
} from '../ds-dynamic-form-ui/models/ds-dynamic-group/dynamic-group.model';
import { isNotEmpty } from '../../../empty.util';
import { FormRowModel } from '../../../../core/shared/config/config-submission-forms.model';
import { AuthorityModel } from '../../../../core/integration/models/authority.model';

export class GroupFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel, protected initFormValues) {
    super(configData, initFormValues);
  }

  public modelFactory(fieldValue: FormFieldMetadataValueObject) {
    const modelConfiguration: DynamicGroupModelConfig = this.initModel();

    if (this.configData && this.configData.rows && this.configData.rows.length > 0) {
      modelConfiguration.formConfiguration = this.configData.rows;
      modelConfiguration.relationFields = [];
      this.configData.rows.forEach((row: FormRowModel) => {
        row.fields.forEach((field: FormFieldModel) => {
          if (field.selectableMetadata[0].metadata === this.configData.selectableMetadata[0].metadata) {
            if (!field.mandatory) {
              // throw new Error(`Configuration not valid: Main field ${this.configData.selectableMetadata[0].metadata} may be mandatory`);
            }
            modelConfiguration.mandatoryField = this.configData.selectableMetadata[0].metadata;
          } else {
            modelConfiguration.relationFields.push(field.selectableMetadata[0].metadata);
          }
        })
      });
    } else {
      throw new Error(`Configuration not valid: ${modelConfiguration.name}`);
    }

    if (isNotEmpty(this.getInitGroupValues())) {
      modelConfiguration.value = [];
      const mandatoryFieldEntries: FormFieldMetadataValueObject[] = this.getInitFieldValues(modelConfiguration.mandatoryField);
      mandatoryFieldEntries.forEach((entry, index) => {
        const item = Object.create(null);
        const listFields = modelConfiguration.relationFields.concat(modelConfiguration.mandatoryField);
        listFields.forEach((fieldId) => {
          const value = this.getInitFieldValue(0, index, [fieldId]);
          if (value) {
            item[fieldId] = value;
          }
        });
        modelConfiguration.value.push(item);
      })
    }
    const cls = {
      element: {
        container: 'mb-0'
      }
    };

    const model = new DynamicGroupModel(modelConfiguration, cls);
    model.name = this.getFieldId()[0];
    return model;
  }

}
