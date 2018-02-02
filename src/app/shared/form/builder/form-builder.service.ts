import { Injectable } from '@angular/core';
import { isEqual, merge, mergeWith } from 'lodash';

import {
  DYNAMIC_FORM_CONTROL_TYPE_ARRAY,
  DYNAMIC_FORM_CONTROL_TYPE_GROUP,
  DynamicFormArrayGroupModel,
  DynamicFormArrayModel,
  DynamicFormControlEvent,
  DynamicFormControlModel,
  DynamicFormGroupModel,
  DynamicFormService,
  DynamicFormValidationService,
  DynamicPathable,
  Utils
} from '@ng-dynamic-forms/core';
import { IntegrationSearchOptions } from '../../../core/integration/models/integration-options.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { isEmpty, isNotEmpty, isNotNull, isNotUndefined, isNull, isUndefined } from '../../empty.util';
import { DynamicComboboxModel } from './ds-dynamic-form-ui/models/ds-dynamic-combobox.model';
import { DynamicTypeaheadModel } from './ds-dynamic-form-ui/models/typeahead/dynamic-typeahead.model';
import { DynamicScrollableDropdownModel } from './ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { SubmissionFormsModel } from '../../../core/shared/config/config-submission-forms.model';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { FormFieldPreviousValueObject } from './models/form-field-previous-value-object';
import { DynamicConcatModel } from './ds-dynamic-form-ui/models/ds-dynamic-concat.model';
import { DynamicListCheckboxGroupModel } from './ds-dynamic-form-ui/models/list/dynamic-list-checkbox-group.model';
import { DynamicGroupModel } from './ds-dynamic-form-ui/models/ds-dynamic-group/dynamic-group.model';
import { DynamicTagModel } from './ds-dynamic-form-ui/models/tag/dynamic-tag.model';
import { DynamicListRadioGroupModel } from './ds-dynamic-form-ui/models/list/dynamic-list-radio-group.model';
import { RowParser } from './parsers/row-parser';

import { DynamicRowArrayModel } from './ds-dynamic-form-ui/models/ds-dynamic-row-array-model';
import { DynamicRowGroupModel } from './ds-dynamic-form-ui/models/ds-dynamic-row-group-model';
import { AuthorityModel } from '../../../core/integration/models/authority.model';

@Injectable()
export class FormBuilderService extends DynamicFormService {

  constructor(formBuilder: FormBuilder,
              validationService: DynamicFormValidationService,
              private operationsBuilder: JsonPatchOperationsBuilder) {
    super(formBuilder, validationService);
  }

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

    const iterateControlModels = (findGroupModel: DynamicFormControlModel[]): void => {
      let iterateResult = Object.create({});

      // Iterate over all group's controls
      for (const controlModel of findGroupModel) {

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
            iterateResult = mergeWith(iterateResult, iterateControlModels(arrayItemModel.group), customizer);
          }
          continue;
        }

        if (controlModel instanceof DynamicFormArrayModel) {
          iterateResult[controlModel.name] = [];
          for (const arrayItemModel of controlModel.groups) {
            iterateResult[controlModel.name].push(iterateControlModels(arrayItemModel.group));
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

        const controlValue = (controlModel as any).value || null;
        if (controlId && iterateResult.hasOwnProperty(controlId) && isNotNull(iterateResult[controlId])) {
          iterateResult[controlId].push(controlValue);
        } else {
          iterateResult[controlId] = isNotEmpty(controlValue) ? (Array.isArray(controlValue) ? controlValue : [controlValue]) : null;
        }
      }

      return iterateResult;
    };

    result = iterateControlModels(groupModel);

    return result;
  }

  modelFromConfiguration(json: string | SubmissionFormsModel, scopeUUID: string, initFormValues: any): DynamicFormControlModel[] | never {
    let rows: DynamicFormControlModel[] = [];
    const rawData = Utils.isString(json) ? JSON.parse(json as string, Utils.parseJSONReviver) : json;

    if (rawData.rows && !isEmpty(rawData.rows)) {
      rawData.rows.forEach((currentRow) => {
        const rowParsed = new RowParser(currentRow, scopeUUID, initFormValues).parse();
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

  hasAuthorityValue(fieldModel) {
    return (fieldModel instanceof DynamicTypeaheadModel || fieldModel instanceof DynamicScrollableDropdownModel);
  }

  getArrayIndexFromEvent(event: DynamicFormControlEvent) {
    let fieldIndex: number;
    if (isNull(event.context)) {
      if (isNotNull(event.model.parent)) {
        if ((event.model.parent as any).type === DYNAMIC_FORM_CONTROL_TYPE_GROUP) {
          if ((event.model.parent as any).parent) {
            if ((event.model.parent as any).parent.context) {
              if ((event.model.parent as any).parent.context.type === DYNAMIC_FORM_CONTROL_TYPE_ARRAY) {
                fieldIndex = (event.model.parent as any).parent.index;
              }
            }
          }
        }
      }
    } else {
      fieldIndex = event.context.index;
    }
    return isNotUndefined(fieldIndex) ? fieldIndex : 0;
  }

  getFieldPathFromChangeEvent(event: DynamicFormControlEvent) {
    const fieldIndex = this.getArrayIndexFromEvent(event);
    const fieldId = this.getFieldPathSegmentedFromChangeEvent(event);
    return (isNotUndefined(fieldIndex)) ? fieldId + '/' + fieldIndex : fieldId;
  }

  getFieldPathSegmentedFromChangeEvent(event: DynamicFormControlEvent) {
    let fieldId;
    if (event.model.parent instanceof DynamicComboboxModel) {
      fieldId = event.model.parent.qualdropId;
    } else {
      fieldId = this.getId(event.model);
    }
    return fieldId;
  }

  getFieldValueFromChangeEvent(event: DynamicFormControlEvent) {
    let fieldValue;
    const value = (event.model as any).value;

    if (this.isModelInCustomGroup(event.model)) {
      fieldValue = (event.model.parent as any).value;
    } else if ((event.model as any).hasLanguages) {
      const language = (event.model as any).language;
      if (this.isModelWithAuthority(event.model)) {
        if (Array.isArray(value)) {
          value.forEach((authority, index) => {
            authority = Object.assign({}, authority, {language: null});
            authority.language = language;
            value[index] = authority;
          });
          fieldValue = value;
        } else {
          fieldValue = Object.assign({}, value, {language: null});
          fieldValue.language = language;
        }
      } else {
        // Language without Authority (input, textArea)
        fieldValue = {
          value: value,
          language: language
        };
      }
    } else {
      // Authority Simple, without language
      fieldValue = value;
    }

    /*else if (isNotEmpty(event.control.value)
           && typeof event.control.value === 'object'
           && (!(event.control.value instanceof AuthorityModel))) {
           fieldValue = [];
           Object.keys(event.control.value)
             .forEach((key) => {
               if (event.control.value[key]) {
                 fieldValue.push({value: key})
               }
             })
         } else {
           fieldValue = event.control.value;
         }*/
    return fieldValue;
  }

  isModelWithAuthority(model: DynamicFormControlModel) {
    return model instanceof DynamicTypeaheadModel ||
      model instanceof DynamicTagModel;
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

  isCustomGroup(model: DynamicFormControlModel) {
    return model &&
      (model instanceof DynamicConcatModel
        || model instanceof DynamicComboboxModel
        || model instanceof DynamicListCheckboxGroupModel
        || model instanceof DynamicListRadioGroupModel);
  }

  isModelInAuthorityGroup(model: DynamicFormControlModel) {
    return (model instanceof DynamicListCheckboxGroupModel || model instanceof DynamicTagModel);
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

  protected dispatchOperationsFromRemoveEvent(pathCombiner: JsonPatchOperationPathCombiner,
                                              event: DynamicFormControlEvent,
                                              previousValue: FormFieldPreviousValueObject) {
    const path = this.getFieldPathFromChangeEvent(event);
    const value = this.getFieldValueFromChangeEvent(event);
    if (event.model.parent instanceof DynamicComboboxModel) {
      this.dispatchOperationsFromMap(this.getComboboxMap(event), pathCombiner, event, previousValue);
    } else if (isNotEmpty(value)) {
      this.operationsBuilder.remove(pathCombiner.getPath(path));
    }
  }

  protected dispatchOperationsFromChangeEvent(pathCombiner: JsonPatchOperationPathCombiner,
                                              event: DynamicFormControlEvent,
                                              previousValue: FormFieldPreviousValueObject,
                                              hasStoredValue: boolean) {
    const path = this.getFieldPathFromChangeEvent(event);
    const segmentedPath = this.getFieldPathSegmentedFromChangeEvent(event);
    const value = this.getFieldValueFromChangeEvent(event);
    if (event.model.parent instanceof DynamicComboboxModel) {
      this.dispatchOperationsFromMap(this.getComboboxMap(event), pathCombiner, event, previousValue);
    } else if (event.model instanceof DynamicGroupModel) {
      this.dispatchOperationsFromMap(this.getValueMap(value), pathCombiner, event, previousValue);
    } else if (this.isModelInAuthorityGroup(event.model)) {
      this.operationsBuilder.add(
        pathCombiner.getPath(segmentedPath),
        value, true);
    } else if (previousValue.isPathEqual(this.getPath(event.model)) || hasStoredValue) {
      if (isEmpty(value)) {
        if (this.getArrayIndexFromEvent(event) === 0) {
          this.operationsBuilder.remove(pathCombiner.getPath(segmentedPath));
        } else {
          this.operationsBuilder.remove(pathCombiner.getPath(path));
        }
      } else {
        this.operationsBuilder.replace(
          pathCombiner.getPath(path),
          value);
      }
      previousValue.delete();
    } else if (isNotEmpty(value)) {
      if (isUndefined(this.getArrayIndexFromEvent(event))
        || this.getArrayIndexFromEvent(event) === 0) {
        this.operationsBuilder.add(
          pathCombiner.getPath(segmentedPath),
          value, true);
      } else {
        this.operationsBuilder.add(
          pathCombiner.getPath(segmentedPath),
          value);
      }
    }
  }

  dispatchOperationsFromEvent(pathCombiner: JsonPatchOperationPathCombiner,
                              event: DynamicFormControlEvent,
                              previousValue: FormFieldPreviousValueObject,
                              hasStoredValue: boolean) {
    switch (event.type) {
      case 'remove':
        this.dispatchOperationsFromRemoveEvent(pathCombiner, event, previousValue);
        break;
      case 'change':
        this.dispatchOperationsFromChangeEvent(pathCombiner, event, previousValue, hasStoredValue);
        break;
      default:
        break;
    }
  }

  public getComboboxMap(event): Map<string, any> {
    const metadataValueMap = new Map();

    (event.model.parent.parent as DynamicFormArrayGroupModel).context.groups.forEach((arrayModel: DynamicFormArrayGroupModel) => {
      const groupModel = arrayModel.group[0] as DynamicComboboxModel;
      const metadataValueList = metadataValueMap.get(groupModel.qualdropId) ? metadataValueMap.get(groupModel.qualdropId) : [];
      if (groupModel.value) {
        metadataValueList.push(groupModel.value);
        metadataValueMap.set(groupModel.qualdropId, metadataValueList);
      }
    });

    return metadataValueMap;
  }

  getValueMap(items: any[]): Map<string, any> {
    const metadataValueMap = new Map();

    items.forEach((item) => {
      Object.keys(item)
        .forEach((key) => {
          const metadataValueList = metadataValueMap.get(key) ? metadataValueMap.get(key) : [];
          metadataValueList.push(item[key]);
          metadataValueMap.set(key, metadataValueList);
        });

    });
    console.log(metadataValueMap);
    return metadataValueMap;
  }

  protected dispatchOperationsFromMap(valueMap: Map<string, any>,
                                      pathCombiner: JsonPatchOperationPathCombiner,
                                      event: DynamicFormControlEvent,
                                      previousValue: FormFieldPreviousValueObject) {
    const currentValueMap = valueMap;
    if (previousValue.isPathEqual(this.getPath(event.model))) {
      previousValue.value.forEach((entry, index) => {
        const currentValue = currentValueMap.get(index);
        if (currentValue) {
          if (!isEqual(entry, currentValue)) {
            this.operationsBuilder.add(pathCombiner.getPath(index), currentValue, true);
          }
          currentValueMap.delete(index);
        } else if (!currentValue) {
          this.operationsBuilder.remove(pathCombiner.getPath(index));
        }
      });
    }
    currentValueMap.forEach((entry, index) => {
      this.operationsBuilder.add(pathCombiner.getPath(index), entry, true);
    });

    previousValue.delete();
  }
}
