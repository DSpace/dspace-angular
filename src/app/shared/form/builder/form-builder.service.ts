import {Injectable, Optional} from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import {
  DYNAMIC_FORM_CONTROL_TYPE_ARRAY,
  DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP,
  DYNAMIC_FORM_CONTROL_TYPE_GROUP,
  DYNAMIC_FORM_CONTROL_TYPE_INPUT,
  DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP,
  DynamicFormArrayGroupModel,
  DynamicFormArrayModel,
  DynamicFormComponentService,
  DynamicFormControlEvent,
  DynamicFormControlModel,
  DynamicFormGroupModel,
  DynamicFormService,
  DynamicFormValidationService,
  DynamicPathable,
  parseReviver,
} from '@ng-dynamic-forms/core';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import mergeWith from 'lodash/mergeWith';

import {
  hasNoValue,
  hasValue,
  isEmpty,
  isNotEmpty,
  isNotNull,
  isNotUndefined,
  isNull, isUndefined
} from '../../empty.util';
import { DynamicQualdropModel } from './ds-dynamic-form-ui/models/ds-dynamic-qualdrop.model';
import { SubmissionFormsModel } from '../../../core/config/models/config-submission-forms.model';
import { DYNAMIC_FORM_CONTROL_TYPE_TAG } from './ds-dynamic-form-ui/models/tag/dynamic-tag.model';
import { RowParser } from './parsers/row-parser';
import { DynamicRelationGroupModel } from './ds-dynamic-form-ui/models/relation-group/dynamic-relation-group.model';
import { DynamicRowArrayModel } from './ds-dynamic-form-ui/models/ds-dynamic-row-array-model';
import { DsDynamicInputModel } from './ds-dynamic-form-ui/models/ds-dynamic-input.model';
import { FormFieldMetadataValueObject } from './models/form-field-metadata-value.model';
import { dateToString, isNgbDateStruct } from '../../date.util';
import { DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP } from './ds-dynamic-form-ui/ds-dynamic-form-constants';
import { CONCAT_GROUP_SUFFIX, DynamicConcatModel } from './ds-dynamic-form-ui/models/ds-dynamic-concat.model';
import { VIRTUAL_METADATA_PREFIX } from '../../../core/shared/metadata.models';
import { ConfigurationDataService } from '../../../core/data/configuration-data.service';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import {
  COMPLEX_GROUP_SUFFIX,
  DynamicComplexModel
} from './ds-dynamic-form-ui/models/ds-dynamic-complex.model';
import { FormRowModel } from '../../../core/config/models/config-submission-form.model';

/**
 * The key for the default type bind field. {'default': 'dc_type'}
 */
export const TYPE_BIND_DEFAULT = 'default';

@Injectable()
export class FormBuilderService extends DynamicFormService {

  /**
   * This map contains the type bind model
   */
  private typeBindModel:  Map<string,DynamicFormControlModel>;

  /**
   * This map contains the active forms model
   */
  private formModels: Map<string, DynamicFormControlModel[]>;

  /**
   * This map contains the active forms control groups
   */
  private formGroups: Map<string, UntypedFormGroup>;

  /**
   * This is the field to use for type binding
   */
  private typeFields: Map<string, string>;

  constructor(
    componentService: DynamicFormComponentService,
    validationService: DynamicFormValidationService,
    protected rowParser: RowParser,
    @Optional() protected configService: ConfigurationDataService,
  ) {
    super(componentService, validationService);
    this.formModels = new Map();
    this.formGroups = new Map();
    this.typeFields = new Map();
    this.typeBindModel = new Map();

    this.typeFields.set(TYPE_BIND_DEFAULT, 'dc_type');
    // If optional config service was passed, perform an initial set of type field (default dc_type) for type binds
    if (hasValue(this.configService)) {
      this.setTypeBindFieldFromConfig();
    }


  }

  createDynamicFormControlEvent(control: UntypedFormControl, group: UntypedFormGroup, model: DynamicFormControlModel, type: string): DynamicFormControlEvent {
    const $event = {
      value: (model as any).value,
      autoSave: false
    };
    const context: DynamicFormArrayGroupModel = (model?.parent instanceof DynamicFormArrayGroupModel) ? model?.parent : null;
    return {$event, context, control: control, group: group, model: model, type};
  }

  /**
   * Get the type bind model associated to the `type-bind`
   *
   * @param typeBingField the special `<type-bind field=..>`
   * @returns the default (dc_type) type bind model or the one associated to the `type-bind` field
   */
  getTypeBindModel(typeBingField: string): DynamicFormControlModel {
    let typeBModelKey = this.typeFields.get(typeBingField);
    if (isUndefined(typeBModelKey)) {
      typeBModelKey = this.typeFields.get(TYPE_BIND_DEFAULT);
    }
    return this.typeBindModel.get(typeBModelKey);
  }

  setTypeBindModel(model: DynamicFormControlModel) {
    this.typeBindModel.set(model.id, model);
  }

  findById(id: string | string[], groupModel: DynamicFormControlModel[], arrayIndex = null): DynamicFormControlModel | null {

    let result = null;
    const findByIdFn = (findId: string | string [], findGroupModel: DynamicFormControlModel[], findArrayIndex): void => {

      for (const controlModel of findGroupModel) {

        const findIdArray = [];
        // If the id is NOT an array, push it into array because we need to iterate over the array
        if (!Array.isArray(findId)) {
          findIdArray.push(findId);
        } else {
          findIdArray.push(...findId);
        }

        for (const findIdIt of findIdArray) {
          if (controlModel.id === findIdIt) {

            if (this.isArrayGroup(controlModel) && isNotNull(findArrayIndex)) {
              result = (controlModel as DynamicFormArrayModel).get(findArrayIndex);
            } else {
              result = controlModel;
            }
            break;
          }

          if (this.isConcatGroup(controlModel)) {
            if (controlModel.id.match(new RegExp(findIdIt + CONCAT_GROUP_SUFFIX))) {
              result = (controlModel as DynamicConcatModel);
              break;
            }
          }

          if (this.isComplexGroup(controlModel)) {
            const regex = new RegExp(findIdIt + COMPLEX_GROUP_SUFFIX);
            if (controlModel.id.match(regex)) {
              result = (controlModel as DynamicComplexModel);
              break;
            }
          }

          if (this.isGroup(controlModel)) {
            findByIdFn(findIdIt, (controlModel as DynamicFormGroupModel).group, findArrayIndex);
          }

          if (this.isArrayGroup(controlModel)
            && (isNull(findArrayIndex) || (controlModel as DynamicFormArrayModel).size > (findArrayIndex))) {
            const index = (isNull(findArrayIndex)) ? 0 : findArrayIndex;
            findByIdFn(findIdIt, (controlModel as DynamicFormArrayModel).get(index).group, index);
          }
        }

      }
    };

    findByIdFn(id, groupModel, arrayIndex);

    return result;
  }

  clearAllModelsValue(groupModel: DynamicFormControlModel[]): void {

    const iterateControlModels = (findGroupModel: DynamicFormControlModel[]): void => {

      for (const controlModel of findGroupModel) {

        if (this.isGroup(controlModel)) {
          iterateControlModels((controlModel as DynamicFormGroupModel).group);
          continue;
        }

        if (this.isArrayGroup(controlModel)) {
          iterateControlModels((controlModel as DynamicFormArrayModel).groupFactory());
          continue;
        }

        if (controlModel.hasOwnProperty('valueChanges')) {
          (controlModel as any).value = undefined;
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

      if (controlModel?.metadataValue?.authority?.includes(VIRTUAL_METADATA_PREFIX)) {
        return controlModel.metadataValue;
      }

      if (isString(controlValue)) {
        return new FormFieldMetadataValueObject(controlValue, controlLanguage, null, null, controlModelIndex);
      } else if (isNgbDateStruct(controlValue)) {
        return new FormFieldMetadataValueObject(dateToString(controlValue));
      } else if (isObject(controlValue)) {
        const authority = (controlValue as any).authority || (controlValue as any).id || null;
        const place = controlModelIndex || (controlValue as any).place;
        if (isNgbDateStruct(controlValue)) {
          return new FormFieldMetadataValueObject(controlValue, controlLanguage, authority, controlValue as any, place);
        } else {
          return new FormFieldMetadataValueObject((controlValue as any).value, controlLanguage, authority, (controlValue as any).display, place, (controlValue as any).confidence);
        }
      }
    };

    const iterateControlModels = (findGroupModel: DynamicFormControlModel[], controlModelIndex: number = 0): void => {
      let iterateResult = Object.create({});

      // Iterate over all group's controls
      for (const controlModel of findGroupModel) {

        if (this.isRowGroup(controlModel) && !this.isCustomOrListGroup(controlModel)) {
          iterateResult = mergeWith(iterateResult, iterateControlModels((controlModel as DynamicFormGroupModel).group), customizer);
          continue;
        }

        if (this.isGroup(controlModel) && !this.isCustomOrListGroup(controlModel)) {
          iterateResult[controlModel.name] = iterateControlModels((controlModel as DynamicFormGroupModel).group);
          continue;
        }

        if (this.isRowArrayGroup(controlModel)) {
          for (const arrayItemModel of (controlModel as DynamicRowArrayModel).groups) {
            iterateResult = mergeWith(iterateResult, iterateControlModels(arrayItemModel.group, arrayItemModel.index), customizer);
          }
          continue;
        }

        if (this.isArrayGroup(controlModel)) {
          iterateResult[controlModel.name] = [];
          for (const arrayItemModel of (controlModel as DynamicFormArrayModel).groups) {
            iterateResult[controlModel.name].push(iterateControlModels(arrayItemModel.group, arrayItemModel.index));
          }
          continue;
        }

        let controlId;
        // Get the field's name
        if (this.isQualdropGroup(controlModel)) {
          // If is instance of DynamicQualdropModel take the qualdrop id as field's name
          controlId = (controlModel as DynamicQualdropModel).qualdropId;
        } else {
          controlId = controlModel.name;
        }

        if (this.isRelationGroup(controlModel)) {
          const values = (controlModel as DynamicRelationGroupModel).getGroupValue();
          values.forEach((groupValue, groupIndex) => {
            const newGroupValue = Object.create({});
            Object.keys(groupValue)
              .forEach((key) => {
                const normValue = normalizeValue(controlModel, groupValue[key], groupIndex);
                if (isNotEmpty(normValue) && normValue.hasValue()) {
                  if (iterateResult.hasOwnProperty(key)) {
                    iterateResult[key].push(normValue);
                  } else {
                    iterateResult[key] = [normValue];
                  }
                }
              });
          });
        } else if (isNotUndefined((controlModel as any).value) && isNotEmpty((controlModel as any).value)) {
          const controlArrayValue = [];
          // Normalize control value as an array of FormFieldMetadataValueObject
          const values = Array.isArray((controlModel as any).value) ? (controlModel as any).value : [(controlModel as any).value];
          values.forEach((controlValue) => {
            controlArrayValue.push(normalizeValue(controlModel, controlValue, controlModelIndex));
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

  modelFromConfiguration(submissionId: string, json: string | SubmissionFormsModel, scopeUUID: string, sectionData: any = {},
                         submissionScope?: string, readOnly = false, typeBindModel = null,
                         isInnerForm = false): DynamicFormControlModel[] | never {
     let rows: DynamicFormControlModel[] = [];
     const rawData = typeof json === 'string' ? JSON.parse(json, parseReviver) : json;
    if (rawData.rows && !isEmpty(rawData.rows)) {
      rawData.rows.forEach((currentRow: FormRowModel) => {
        const rowParsed = this.rowParser.parse(submissionId, currentRow, scopeUUID, sectionData, submissionScope,
          readOnly);
        if (isNotNull(rowParsed)) {
          if (Array.isArray(rowParsed)) {
            rows = rows.concat(rowParsed);
          } else {
            rows.push(rowParsed);
          }
        }
      });
    }

    if (hasNoValue(typeBindModel)) {
      typeBindModel = this.findById(Array.from(this.typeFields.values()), rows);
    }

    if (hasValue(typeBindModel)) {
      this.setTypeBindModel(typeBindModel);
    }
    return rows;
  }

  isModelInCustomGroup(model: DynamicFormControlModel): boolean {
    return this.isCustomGroup((model as any).parent);
  }

  hasArrayGroupValue(model: DynamicFormControlModel): boolean {
    return model && (this.isListGroup(model) || model.type === DYNAMIC_FORM_CONTROL_TYPE_TAG);
  }

  hasMappedGroupValue(model: DynamicFormControlModel): boolean {
    return (this.isQualdropGroup((model as any).parent)
      || this.isRelationGroup((model as any).parent));
  }

  isGroup(model: DynamicFormControlModel): boolean {
    return model && (model.type === DYNAMIC_FORM_CONTROL_TYPE_GROUP || model.type === DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP);
  }

  isQualdropGroup(model: DynamicFormControlModel): boolean {
    return (model && model.type === DYNAMIC_FORM_CONTROL_TYPE_GROUP && hasValue((model as any).qualdropId));
  }

  isCustomGroup(model: DynamicFormControlModel): boolean {
    return model && ((model as any).type === DYNAMIC_FORM_CONTROL_TYPE_GROUP && (model as any).isCustomGroup === true);
  }

  isConcatGroup(model: DynamicFormControlModel): boolean {
    return this.isCustomGroup(model) && (model.id.indexOf(CONCAT_GROUP_SUFFIX) !== -1);
  }

  public isComplexGroup(model: DynamicFormControlModel): boolean {
    return this.isCustomGroup(model) && model.id.indexOf(COMPLEX_GROUP_SUFFIX) !== -1;
  }

  isRowGroup(model: DynamicFormControlModel): boolean {
    return model && ((model as any).type === DYNAMIC_FORM_CONTROL_TYPE_GROUP && (model as any).isRowGroup === true);
  }

  isCustomOrListGroup(model: DynamicFormControlModel): boolean {
    return model &&
      (this.isCustomGroup(model)
        || this.isListGroup(model));
  }

  isListGroup(model: DynamicFormControlModel): boolean {
    return model &&
      ((model.type === DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP && (model as any).isListGroup === true)
        || (model.type === DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP && (model as any).isListGroup === true));
  }

  isRelationGroup(model: DynamicFormControlModel): boolean {
    return model && model.type === DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP;
  }

  isRowArrayGroup(model: DynamicFormControlModel): boolean {
    return model.type === DYNAMIC_FORM_CONTROL_TYPE_ARRAY && (model as any).isRowArray === true;
  }

  isArrayGroup(model: DynamicFormControlModel): boolean {
    return model.type === DYNAMIC_FORM_CONTROL_TYPE_ARRAY;
  }

  isInputModel(model: DynamicFormControlModel): boolean {
    return model.type === DYNAMIC_FORM_CONTROL_TYPE_INPUT;
  }

  getFormControlById(id: string, formGroup: UntypedFormGroup, groupModel: DynamicFormControlModel[], index = 0): AbstractControl {
    const fieldModel = this.findById(id, groupModel, index);
    return isNotEmpty(fieldModel) ? formGroup.get(this.getPath(fieldModel)) : null;
  }

  getFormControlByModel(formGroup: UntypedFormGroup, fieldModel: DynamicFormControlModel): AbstractControl {
    return isNotEmpty(fieldModel) ? formGroup.get(this.getPath(fieldModel)) : null;
  }

  /**
   * Note (discovered while debugging) this is not the ID as used in the form,
   * but the first part of the path needed in a patch operation:
   * e.g. add foo/0 -> the id is 'foo'
   */
  getId(model: DynamicPathable): string {
    let tempModel: DynamicFormControlModel;

    if (this.isArrayGroup(model as DynamicFormControlModel)) {
      return model.index.toString();
    } else if (this.isModelInCustomGroup(model as DynamicFormControlModel)) {
      tempModel = (model as any).parent;
    } else {
      tempModel = (model as any);
    }

    return (tempModel.id !== tempModel.name) ? tempModel.name : tempModel.id;
  }

  /**
   * If present, remove form model from formModels map
   * @param id id of model
   */
  removeFormModel(id: string): void {
    if (this.formModels.has(id)) {
      this.formModels.delete(id);
    }
  }

  /**
   * Add new form model to formModels map
   * @param id id of model
   * @param formGroup FormGroup
   */
  addFormGroups(id: string, formGroup: UntypedFormGroup): void {
    this.formGroups.set(id, formGroup);
  }

  /**
   * If present, remove form model from formModels map
   * @param id id of model
   */
  removeFormGroup(id: string): void {
    if (this.formGroups.has(id)) {
      this.formGroups.delete(id);
    }
  }

  /**
   * Calculate the metadata list related to the event.
   * @param event
   */
  getMetadataIdsFromEvent(event: DynamicFormControlEvent): string[] {

    let model = event.model;
    while (model.parent) {
      model = model.parent as any;
    }

    const iterateControlModels = (findGroupModel: DynamicFormControlModel[], controlModelIndex: number = 0): string[] => {
      let iterateResult = Object.create({});

      // Iterate over all group's controls
      for (const controlModel of findGroupModel) {

        if (this.isRowGroup(controlModel) && !this.isCustomOrListGroup(controlModel)) {
          iterateResult = mergeWith(iterateResult, iterateControlModels((controlModel as DynamicFormGroupModel).group));
          continue;
        }

        if (this.isGroup(controlModel) && !this.isCustomOrListGroup(controlModel)) {
          iterateResult[controlModel.name] = iterateControlModels((controlModel as DynamicFormGroupModel).group);
          continue;
        }

        if (this.isRowArrayGroup(controlModel)) {
          for (const arrayItemModel of (controlModel as DynamicRowArrayModel).groups) {
            iterateResult = mergeWith(iterateResult, iterateControlModels(arrayItemModel.group, arrayItemModel.index));
          }
          continue;
        }

        if (this.isArrayGroup(controlModel)) {
          iterateResult[controlModel.name] = [];
          for (const arrayItemModel of (controlModel as DynamicFormArrayModel).groups) {
            iterateResult[controlModel.name].push(iterateControlModels(arrayItemModel.group, arrayItemModel.index));
          }
          continue;
        }

        let controlId;
        // Get the field's name
        if (this.isQualdropGroup(controlModel)) {
          // If is instance of DynamicQualdropModel take the qualdrop id as field's name
          controlId = (controlModel as DynamicQualdropModel).qualdropId;
        } else {
          controlId = controlModel.name;
        }

        if (this.isRelationGroup(controlModel)) {
          const values = (controlModel as DynamicRelationGroupModel).getGroupValue();
          values.forEach((groupValue, groupIndex) => {
            Object.keys(groupValue).forEach((key) => {
              iterateResult[key] = true;
            });
          });
        } else {
          iterateResult[controlId] = true;
        }

      }

      return iterateResult;
    };

    const result = iterateControlModels([model]);

    return Object.keys(result);
  }

  /**
   * Get the type bind field from config
   */
  setTypeBindFieldFromConfig(metadataField: string = null): void {
    this.configService.findByPropertyName('submit.type-bind.field').pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((remoteData: any) => {
      // make sure we got a success response from the backend
      if (!remoteData.hasSucceeded) {
        return;
      }

      // All cfg property values
      const typeFieldConfigValues = remoteData.payload.values;
      let typeFieldConfigValue = '';
      // Iterate over each config property value
      typeFieldConfigValues.forEach((typeFieldConfig: string) => {
        // Check if the typeFieldConfig contains the '=>' delimiter
        if (typeFieldConfig.includes('=>')) {
          // Split the typeFieldConfig into parts based on the delimiter
          const [metadataFieldConfigPart, valuePart] = typeFieldConfig.split('=>');
          // Process only custom type-bind fields
          if (isNotEmpty(valuePart)) {
            // Replace '.' with '_' in the valuePart
            const normalizedValuePart = valuePart.replace(/\./g, '_');

            // Set the value in the typeFields map
            this.typeFields.set(metadataFieldConfigPart, normalizedValuePart);

            if (metadataFieldConfigPart === metadataField) {
              typeFieldConfigValue = valuePart;
            }
          }
        } else {
          // If no delimiter is found, use the entire typeFieldConfig as the default value
          typeFieldConfigValue = typeFieldConfig;
        }

        // Always update the typeFields map with the default value, normalized
        this.typeFields.set(TYPE_BIND_DEFAULT, typeFieldConfigValue.replace(/\./g, '_'));
      });
    });
  }

  /**
   * Get type field. If the type isn't already set, and a ConfigurationDataService is provided, set (with subscribe)
   * from back end. Otherwise, get/set a default "dc_type" value or specific value from the typeFields map.
   */
  getTypeField(metadataField: string): string {
    if (hasValue(this.configService) && isEmpty(this.typeFields.values())) {
      this.setTypeBindFieldFromConfig(metadataField);
    } else if (hasNoValue(this.typeFields.get(TYPE_BIND_DEFAULT))) {
      this.typeFields.set(TYPE_BIND_DEFAULT, 'dc_type');
    }

    return this.typeFields.get(metadataField) || this.typeFields.get(TYPE_BIND_DEFAULT);
  }

}
