import { SubmissionFieldScopeType } from './../../../../core/submission/submission-field-scope-type';
import { SectionVisibility } from './../../../../submission/objects/section-visibility.model';
import { Injectable, Injector } from '@angular/core';

import { DYNAMIC_FORM_CONTROL_TYPE_ARRAY, DynamicFormGroupModelConfig } from '@ng-dynamic-forms/core';
import uniqueId from 'lodash/uniqueId';

import { isEmpty, isNotEmpty } from '../../../empty.util';
import { DynamicRowGroupModel } from '../ds-dynamic-form-ui/models/ds-dynamic-row-group-model';
import { FormFieldModel } from '../models/form-field.model';
import { CONFIG_DATA, FieldParser, INIT_FORM_VALUES, PARSER_OPTIONS, SUBMISSION_ID } from './field-parser';
import { ParserFactory } from './parser-factory';
import { ParserOptions } from './parser-options';
import { ParserType } from './parser-type';
import { setLayout } from './parser.utils';
import { DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP } from '../ds-dynamic-form-ui/ds-dynamic-form-constants';
import { SubmissionScopeType } from '../../../../core/submission/submission-scope-type';

export const ROW_ID_PREFIX = 'df-row-group-config-';

@Injectable({
  providedIn: 'root'
})

/**
 * Parser the submission data for a single row
 */
export class RowParser {
  constructor(private parentInjector: Injector) {
  }

  public parse(submissionId: string,
               rowData,
               scopeUUID,
               initFormValues: any,
               submissionScope,
               readOnly: boolean,
               typeField: string): DynamicRowGroupModel {
    let fieldModel: any = null;
    let parsedResult = null;
    const config: DynamicFormGroupModelConfig = {
      id: uniqueId(ROW_ID_PREFIX),
      group: [],
    };

    const scopedFields: FormFieldModel[] = this.filterScopedFields(rowData.fields, submissionScope);

    const layoutDefaultGridClass = ' col-sm-' + Math.trunc(12 / scopedFields.length);
    const layoutClass = ' d-flex flex-column justify-content-start';

    const parserOptions: ParserOptions = {
      readOnly: readOnly,
      submissionScope: submissionScope,
      collectionUUID: scopeUUID,
      typeField: typeField
    };

    // Iterate over row's fields
    scopedFields.forEach((fieldData: FormFieldModel) => {

      const layoutFieldClass = (fieldData.style || layoutDefaultGridClass) + layoutClass;
      const parserProvider = ParserFactory.getProvider(fieldData.input.type as ParserType);
      if (parserProvider) {
        const fieldInjector = Injector.create({
          providers: [
            parserProvider,
            { provide: SUBMISSION_ID, useValue: submissionId },
            { provide: CONFIG_DATA, useValue: fieldData },
            { provide: INIT_FORM_VALUES, useValue: initFormValues },
            { provide: PARSER_OPTIONS, useValue: parserOptions }
          ],
          parent: this.parentInjector
        });

        fieldModel = fieldInjector.get(FieldParser).parse();
      } else {
        throw new Error(`unknown form control model type "${fieldData.input.type}" defined for Input field with label "${fieldData.label}".`,);
      }

      if (fieldModel) {
        if (fieldModel.type === DYNAMIC_FORM_CONTROL_TYPE_ARRAY || fieldModel.type === DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP) {
          if (rowData.fields.length > 1) {
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
            });
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
        parsedResult.push(groupModel);
      } else {
        parsedResult = groupModel;
      }
    }
    return parsedResult;
  }

  checksFieldScope(fieldScope, submissionScope, visibility: SectionVisibility) {
    return (isEmpty(fieldScope) || !this.isHidden(visibility, fieldScope, submissionScope));
  }

  /**
   * Check if the field is hidden or not.
   * It is hidden when we do have the scope,
   * but we do not have the visibility,
   * also the field scope should be different from the submissionScope.
   * @param visibility The visibility of the field
   * @param scope the scope of the field
   * @param submissionScope the scope of the submission
   * @returns If the field is hidden or not
   */
  private isHidden(visibility: SectionVisibility, scope: string, submissionScope: string): boolean {
    return isNotEmpty(scope)
      && (
        isEmpty(visibility)
        && (
          submissionScope === SubmissionScopeType.WorkspaceItem && scope !== SubmissionFieldScopeType.WorkspaceItem
          ||
          submissionScope === SubmissionScopeType.WorkflowItem && scope !== SubmissionFieldScopeType.WorkflowItem
        )
      );
  }

  filterScopedFields(fields: FormFieldModel[], submissionScope): FormFieldModel[] {
    const filteredFields: FormFieldModel[] = [];
    fields.forEach((field: FormFieldModel) => {
      // Whether field scope doesn't match the submission scope, skip it
      if (this.checksFieldScope(field.scope, submissionScope, field.visibility)) {
        filteredFields.push(field);
      }
    });
    return filteredFields;
  }
}
