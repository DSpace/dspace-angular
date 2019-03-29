import { DYNAMIC_FORM_CONTROL_TYPE_ARRAY, DynamicFormGroupModelConfig } from '@ng-dynamic-forms/core';
import { uniqueId } from 'lodash';

import { IntegrationSearchOptions } from '../../../../core/integration/models/integration-options.model';
import { DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP } from '../ds-dynamic-form-ui/models/relation-group/dynamic-relation-group.model';
import { DynamicRowGroupModel } from '../ds-dynamic-form-ui/models/ds-dynamic-row-group-model';
import { isEmpty } from '../../../empty.util';
import { setLayout } from './parser.utils';
import { FormFieldModel } from '../models/form-field.model';
import { ParserType } from './parser-type';
import { ParserOptions } from './parser-options';
import { ParserFactory } from './parser-factory';

export const ROW_ID_PREFIX = 'df-row-group-config-';

export class RowParser {
  protected authorityOptions: IntegrationSearchOptions;

  constructor(protected rowData,
              protected scopeUUID,
              protected initFormValues: any,
              protected submissionScope,
              protected readOnly: boolean) {
    this.authorityOptions = new IntegrationSearchOptions(scopeUUID);
  }

  public parse(): DynamicRowGroupModel {
    let fieldModel: any = null;
    let parsedResult = null;
    const config: DynamicFormGroupModelConfig = {
      id: uniqueId(ROW_ID_PREFIX),
      group: [],
    };

    const scopedFields: FormFieldModel[] = this.filterScopedFields(this.rowData.fields);

    const layoutDefaultGridClass = ' col-sm-' + Math.trunc(12 / scopedFields.length);
    const layoutClass = ' d-flex flex-column justify-content-start';

    const parserOptions: ParserOptions = {
      readOnly: this.readOnly,
      submissionScope: this.submissionScope,
      authorityUuid: this.authorityOptions.uuid
    };

    // Iterate over row's fields
    scopedFields.forEach((fieldData: FormFieldModel) => {

      const layoutFieldClass = (fieldData.style || layoutDefaultGridClass) + layoutClass;
      const parserCo = ParserFactory.getConstructor(fieldData.input.type as ParserType);
      if (parserCo) {
        fieldModel = new parserCo(fieldData, this.initFormValues, parserOptions).parse();
      } else {
        throw new Error(`unknown form control model type "${fieldData.input.type}" defined for Input field with label "${fieldData.label}".`, );
      }

      if (fieldModel) {
        if (fieldModel.type === DYNAMIC_FORM_CONTROL_TYPE_ARRAY || fieldModel.type === DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP) {
          if (this.rowData.fields.length > 1) {
            setLayout(fieldModel, 'grid', 'host', layoutFieldClass);
            config.group.push(fieldModel);
            // if (isEmpty(parsedResult)) {
            //   parsedResult = [];
            // }
            // parsedResult.push(fieldModel);
          } else {
            parsedResult = fieldModel;
          }
          return;
        } else {
          if (Array.isArray(fieldModel)) {
            fieldModel.forEach((model) => {
              parsedResult = model;
              return;
            })
          } else {
            setLayout(fieldModel, 'grid', 'host', layoutFieldClass);
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

  checksFieldScope(fieldScope) {
    return (isEmpty(fieldScope) || isEmpty(this.submissionScope) || fieldScope === this.submissionScope);
  }

  filterScopedFields(fields: FormFieldModel[]): FormFieldModel[] {
    const filteredFields: FormFieldModel[] = [];
    fields.forEach((field: FormFieldModel) => {
      // Whether field scope doesn't match the submission scope, skip it
      if (this.checksFieldScope(field.scope)) {
        filteredFields.push(field);
      }
    });
    return filteredFields;
  }
}
