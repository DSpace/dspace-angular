import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import {
  DynamicFormArrayGroupModel,
  DynamicFormArrayModel,
  DynamicFormControlModel,
  DynamicFormGroupModel,
  DynamicFormService,
  DynamicPathable,
  JSONUtils,
} from '@ng-dynamic-forms/core';
import { mergeWith, isObject } from 'lodash';

import { isEmpty, isNotEmpty, isNotNull, isNotUndefined, isNull } from '../../empty.util';
import { DynamicComboboxModel } from './ds-dynamic-form-ui/models/ds-dynamic-combobox.model';
import { SubmissionFormsModel } from '../../../core/shared/config/config-submission-forms.model';
import { DynamicConcatModel } from './ds-dynamic-form-ui/models/ds-dynamic-concat.model';
import { DynamicListCheckboxGroupModel } from './ds-dynamic-form-ui/models/list/dynamic-list-checkbox-group.model';
import {
  DYNAMIC_FORM_CONTROL_TYPE_RELATION,
  DynamicGroupModel
} from './ds-dynamic-form-ui/models/dynamic-group/dynamic-group.model';
import { DYNAMIC_FORM_CONTROL_TYPE_TAG, DynamicTagModel } from './ds-dynamic-form-ui/models/tag/dynamic-tag.model';
import { DynamicListRadioGroupModel } from './ds-dynamic-form-ui/models/list/dynamic-list-radio-group.model';
import { RowParser } from './parsers/row-parser';

import { DynamicRowArrayModel } from './ds-dynamic-form-ui/models/ds-dynamic-row-array-model';
import { DynamicRowGroupModel } from './ds-dynamic-form-ui/models/ds-dynamic-row-group-model';
import { DsDynamicInputModel } from './ds-dynamic-form-ui/models/ds-dynamic-input.model';
import { FormFieldMetadataValueObject } from './models/form-field-metadata-value.model';
import { AuthorityValueModel } from '../../../core/integration/models/authority-value.model';

@Injectable()
export class FormBuilderService extends DynamicFormService {

  findById(id: string, groupModel: DynamicFormControlModel[], arrayIndex = null): DynamicFormControlModel | null {

    let result = null;
    const findByIdFn = (findId: string, findGroupModel: DynamicFormControlModel[]): void => {

      for (const controlModel of findGroupModel) {

        if (controlModel.id === findId) {
          if (controlModel instanceof DynamicFormArrayModel && isNotNull(arrayIndex)) {
            result = controlModel.get(arrayIndex);
          } else {
            result = controlModel;
          }
          break;
        }

        if (controlModel instanceof DynamicFormGroupModel) {
          findByIdFn(findId, (controlModel as DynamicFormGroupModel).group);
        }

        if (controlModel instanceof DynamicFormArrayModel && (isNull(arrayIndex) || controlModel.size > (arrayIndex))) {
          arrayIndex = (isNull(arrayIndex)) ? 0 : arrayIndex;
          findByIdFn(findId, controlModel.get(arrayIndex).group);
        }
      }
    };

    findByIdFn(id, groupModel);

    return result;
  }

  clearAllModelsValue(groupModel: DynamicFormControlModel[]): void {

    const iterateControlModels = (findGroupModel: DynamicFormControlModel[]): void => {

      for (const controlModel of findGroupModel) {

        if (controlModel instanceof DynamicFormGroupModel) {
          iterateControlModels((controlModel as DynamicFormGroupModel).group);
          continue;
        }

        if (controlModel instanceof DynamicFormArrayModel) {
          iterateControlModels(controlModel.groupFactory());
          continue;
        }

        if (controlModel.hasOwnProperty('valueUpdates')) {
          (controlModel as any).valueUpdates.next(undefined);
        }
      }
    };

    iterateControlModels(groupModel);
  }

  getValueFromModel(groupModel: DynamicFormControlModel[]): void {

    let result = Object.create({});

    const customizer = (objValue, srcValue) => {
      if (Array.isArray(objValue)) {
        return objValue.concat(srcValue);
      }
    };

    const normalizeValue = (controlModel, controlValue, controlModelIndex) => {
      const controlLanguage = (controlModel as DsDynamicInputModel).hasLanguages ? (controlModel as DsDynamicInputModel).language : null;
      if (((isObject(controlValue) && controlValue.id) || controlValue instanceof AuthorityValueModel)) {
        return new FormFieldMetadataValueObject(controlValue.value, controlLanguage, controlValue.id, controlValue.display, controlModelIndex);
      } else if (!(controlValue instanceof FormFieldMetadataValueObject)) {
        return new FormFieldMetadataValueObject(controlValue, controlLanguage, null, null, controlModelIndex);
      } else {
        const place = controlModelIndex || controlValue.place;
        return Object.assign(new FormFieldMetadataValueObject(), controlValue, {place});
      }
    };

    const iterateControlModels = (findGroupModel: DynamicFormControlModel[], controlModelIndex: number = 0): void => {
      let iterateResult = Object.create({});

      // Iterate over all group's controls
      for (const controlModel of findGroupModel) {
      /* tslint:disable-next-line:no-shadowed-variable */
      // for (const {controlModel, controlModelIndex} of findGroupModel.map((controlModel, controlModelIndex) => ({ controlModel, controlModelIndex }))) {

        if (controlModel instanceof DynamicRowGroupModel && !this.isCustomGroup(controlModel)) {
          iterateResult = mergeWith(iterateResult, iterateControlModels((controlModel as DynamicFormGroupModel).group), customizer);
          continue;
        }

        if (controlModel instanceof DynamicFormGroupModel && !this.isCustomGroup(controlModel)) {
          iterateResult[controlModel.name] = iterateControlModels((controlModel as DynamicFormGroupModel).group);
          continue;
        }

        if (controlModel instanceof DynamicRowArrayModel) {
          for (const arrayItemModel of controlModel.groups) {
            iterateResult = mergeWith(iterateResult, iterateControlModels(arrayItemModel.group, arrayItemModel.index), customizer);
          }
          continue;
        }

        if (controlModel instanceof DynamicFormArrayModel) {
          iterateResult[controlModel.name] = [];
          for (const arrayItemModel of controlModel.groups) {
            iterateResult[controlModel.name].push(iterateControlModels(arrayItemModel.group, arrayItemModel.index));
          }
          continue;
        }

        let controlId;
        // Get the field's name
        if (controlModel instanceof DynamicComboboxModel) {
          // If is instance of DynamicComboboxModel take the qualdrop id as field's name
          controlId = controlModel.qualdropId;
        } else {
          controlId = controlModel.name;
        }

        if (controlModel instanceof DynamicGroupModel) {
          const values = (controlModel as any).value;
          values.forEach((groupValue, groupIndex) => {
            const newGroupValue = Object.create({});
            Object.keys(groupValue)
              .forEach((key) => {
                const normValue = normalizeValue(controlModel, groupValue[key], groupIndex);
                if (iterateResult.hasOwnProperty(key)) {
                  iterateResult[key].push(normValue);
                } else {
                  iterateResult[key] = [normValue];
                }
                // newGroupValue[key] = normalizeValue(controlModel, groupValue[key], groupIndex);
              });
            // controlArrayValue.push(newGroupValue);
          })
        } else if (isNotUndefined((controlModel as any).value) && isNotEmpty((controlModel as any).value)) {
          const controlArrayValue = [];
          // Normalize control value as an array of FormFieldMetadataValueObject
          const values = Array.isArray((controlModel as any).value) ? (controlModel as any).value : [(controlModel as any).value];
          values.forEach((controlValue) => {
            controlArrayValue.push(normalizeValue(controlModel, controlValue, controlModelIndex))
          });

          if (controlId && iterateResult.hasOwnProperty(controlId) && isNotNull(iterateResult[controlId])) {
            iterateResult[controlId] = iterateResult[controlId].concat(controlArrayValue);
          } else {
            iterateResult[controlId] = isNotEmpty(controlArrayValue) ? controlArrayValue : null;
          }
        }

      }

      return iterateResult;
    };

    result = iterateControlModels(groupModel);

    return result;
  }

  modelFromConfiguration(json: string | SubmissionFormsModel, scopeUUID: string, initFormValues: any = {}, submissionScope?: string, readOnly = false): DynamicFormControlModel[] | never {
    let rows: DynamicFormControlModel[] = [];
    const rawData = typeof json === 'string' ? JSON.parse(json, JSONUtils.parseReviver) : json;

    if (rawData.rows && !isEmpty(rawData.rows)) {
      rawData.rows.forEach((currentRow) => {
        const rowParsed = new RowParser(currentRow, scopeUUID, initFormValues, submissionScope, readOnly).parse();
        if (isNotNull(rowParsed)) {
          if (Array.isArray(rowParsed)) {
            rows = rows.concat(rowParsed);
          } else {
            rows.push(rowParsed);
          }
        }
      });
    }

    return rows;
  }

  isModelInCustomGroup(model: DynamicFormControlModel) {
    return model.parent &&
      (model.parent instanceof DynamicConcatModel
        || model.parent instanceof DynamicComboboxModel);
  }

  hasMappedGroupValue(model: DynamicFormControlModel) {
    return ((model.parent && model.parent instanceof DynamicComboboxModel)
      || model.parent instanceof DynamicGroupModel);
  }

  isComboboxGroup(model: DynamicFormControlModel) {
    return model && model instanceof DynamicComboboxModel;
  }

  isCustomGroup(model: DynamicFormControlModel) {
    return model &&
      (model instanceof DynamicConcatModel
        || model instanceof DynamicComboboxModel
        || this.isListGroup(model));
  }

  isListGroup(model: DynamicFormControlModel) {
    return model &&
      (model instanceof DynamicListCheckboxGroupModel
        || model instanceof DynamicListRadioGroupModel);
  }

  isModelInAuthorityGroup(model: DynamicFormControlModel) {
    return model && (this.isListGroup(model) || model.type === DYNAMIC_FORM_CONTROL_TYPE_TAG);
  }

  isRelationGroup(model: DynamicFormControlModel) {
    return model && model.type === DYNAMIC_FORM_CONTROL_TYPE_RELATION;
  }

  getFormControlById(id: string, formGroup: FormGroup, groupModel: DynamicFormControlModel[], index = 0) {
    const fieldModel = this.findById(id, groupModel, index);
    return isNotEmpty(fieldModel) ? formGroup.get(this.getPath(fieldModel)) : null;
  }

  getId(model: DynamicPathable) {
    if (model instanceof DynamicFormArrayGroupModel) {
      return model.index.toString();
    } else {
      return ((model as DynamicFormControlModel).id !== (model as DynamicFormControlModel).name) ?
        (model as DynamicFormControlModel).name :
        (model as DynamicFormControlModel).id;
    }
  }

}
