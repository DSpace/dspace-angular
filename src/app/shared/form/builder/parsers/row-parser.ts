import { DynamicFormArrayModel, DynamicFormControlModel, DynamicFormGroupModelConfig } from '@ng-dynamic-forms/core';
import { uniqueId } from 'lodash';

import { DateFieldParser } from './date-field-parser';
import { DropdownFieldParser } from './dropdown-field-parser';
import { ListFieldParser } from './list-field-parser';
import { OneboxFieldParser } from './onebox-field-parser';
import { NameFieldParser } from './name-field-parser';
import { SeriesFieldParser } from './series-field-parser';
import { TagFieldParser } from './tag-field-parser';
import { TextareaFieldParser } from './textarea-field-parser';
import { GroupFieldParser } from './group-field-parser';
import { IntegrationSearchOptions } from '../../../../core/integration/models/integration-options.model';
import { DynamicGroupModel } from '../ds-dynamic-form-ui/models/ds-dynamic-group/dynamic-group.model';
import { DynamicRowGroupModel } from '../ds-dynamic-form-ui/models/ds-dynamic-row-group-model';
import { isEmpty } from '../../../empty.util';
import { LookupFieldParser } from './lookup-field-parser';
import { LookupNameFieldParser } from './lookup-name-field-parser';
import { DsDynamicInputModel } from '../ds-dynamic-form-ui/models/ds-dynamic-input.model';

export const ROW_ID_PREFIX = 'df-row-group-config-';

export class RowParser {
  protected authorityOptions: IntegrationSearchOptions;

  constructor(protected rowData, protected scopeUUID, protected initFormValues: any) {
    this.authorityOptions = new IntegrationSearchOptions(scopeUUID);
  }

  public parse(): DynamicRowGroupModel {
    let fieldModel: any = null;
    let parsedResult = null;
    const config: DynamicFormGroupModelConfig = {
      id: uniqueId(ROW_ID_PREFIX),
      group: [],
    };

    const clsGridClass = ' col-sm-' + Math.trunc(12 / this.rowData.fields.length);

    this.rowData.fields.forEach((fieldData) => {

      switch (fieldData.input.type) {
        case 'date':
          fieldModel = (new DateFieldParser(fieldData, this.initFormValues).parse());
          break;

        case 'dropdown':
          fieldModel = (new DropdownFieldParser(fieldData, this.initFormValues, this.authorityOptions.uuid).parse());
          break;

        case 'list':
          fieldModel = (new ListFieldParser(fieldData, this.initFormValues, this.authorityOptions.uuid).parse());
          break;

        case 'lookup':
          fieldModel = (new LookupFieldParser(fieldData, this.initFormValues, this.authorityOptions.uuid).parse());
          break;

        case 'onebox':
          fieldModel = (new OneboxFieldParser(fieldData, this.initFormValues, this.authorityOptions.uuid).parse());
          break;

        case 'lookup-name':
          fieldModel = (new LookupNameFieldParser(fieldData, this.initFormValues, this.authorityOptions.uuid).parse());
          break;

        case 'name':
          fieldModel = (new NameFieldParser(fieldData, this.initFormValues).parse());
          break;

        case 'series':
          fieldModel = (new SeriesFieldParser(fieldData, this.initFormValues).parse());
          break;

        case 'tag':
          fieldModel = (new TagFieldParser(fieldData, this.initFormValues, this.authorityOptions.uuid).parse());
          break;

        case 'textarea':
          fieldModel = (new TextareaFieldParser(fieldData, this.initFormValues).parse());
          break;

        case 'group':
          fieldModel = new GroupFieldParser(fieldData, this.initFormValues, this.authorityOptions.uuid).parse();
          break;

        case 'twobox':
          // group.push(new TwoboxFieldParser(fieldData).parse());
          break;

        default:
          throw new Error(`unknown form control model type defined on JSON object with label "${fieldData.label}"`);
      }

      if (fieldModel) {
        if (fieldModel instanceof DynamicFormArrayModel || fieldModel instanceof DynamicGroupModel) {
          if (this.rowData.fields.length > 1) {
            fieldModel.cls.grid.host = (fieldModel.cls.grid.host) ? fieldModel.cls.grid.host + clsGridClass : clsGridClass;
            parsedResult = [fieldModel]
          } else {
            parsedResult = fieldModel;
          }
          return;
        } else {
          if (fieldModel instanceof Array) {
            fieldModel.forEach((model) => {
              parsedResult = model;
              return;
            })
          } else {
            fieldModel.cls.grid.host = (fieldModel.cls.grid.host) ? fieldModel.cls.grid.host + clsGridClass : clsGridClass;
            config.group.push(fieldModel);
          }
        }
        fieldModel = null;
      }
    });

    if (config && !isEmpty(config.group)) {
      const clsGroup = {
        element: {
          control: 'form-row',
        }
      };
      const groupModel = new DynamicRowGroupModel(config, clsGroup);
      if (Array.isArray(parsedResult)) {
        parsedResult.push(groupModel)
      } else {
        parsedResult = groupModel;
      }
    }
    return parsedResult;
  }

}
