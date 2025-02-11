import { Injectable, Optional } from '@angular/core';
import { AbstractControl, FormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

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
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';

import {
  hasNoValue,
  hasValue,
  isEmpty,
  isNotEmpty,
  isNotNull,
  isNotUndefined,
  isNull,
  isObjectEmpty
} from '../../empty.util';
import { DynamicQualdropModel } from './ds-dynamic-form-ui/models/ds-dynamic-qualdrop.model';
import { SubmissionFormsModel } from '../../../core/config/models/config-submission-forms.model';
import { DYNAMIC_FORM_CONTROL_TYPE_TAG } from './ds-dynamic-form-ui/models/tag/dynamic-tag.model';
import { RowParser } from './parsers/row-parser';
import {
  DynamicRelationGroupModel,
  DynamicRelationGroupModelConfig
} from './ds-dynamic-form-ui/models/relation-group/dynamic-relation-group.model';
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
  DYNAMIC_FORM_CONTROL_TYPE_SCROLLABLE_DROPDOWN
} from './ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model';

@Injectable()
export class FormBuilderService extends DynamicFormService {

  private typeBindModel: BehaviorSubject<DynamicFormControlModel> = new BehaviorSubject<DynamicFormControlModel>(null);

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
  private typeField: string;

  constructor(
    componentService: DynamicFormComponentService,
    validationService: DynamicFormValidationService,
    protected rowParser: RowParser,
    @Optional() protected configService: ConfigurationDataService,
  ) {
    super(componentService, validationService);
    this.formModels = new Map();
    this.formGroups = new Map();
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

  getTypeBindModel() {
    return this.typeBindModel.getValue();
  }

  getTypeBindModelUpdates(): Observable<any> {
    return this.typeBindModel.pipe(
      distinctUntilChanged(),
      switchMap((bindModel: any) => bindModel.valueChanges),
      distinctUntilChanged(),
    );
  }

  setTypeBindModel(model: DynamicFormControlModel) {
    this.typeBindModel.next(model);
  }

  findById(id: string, groupModel: DynamicFormControlModel[], arrayIndex = null): DynamicFormControlModel | null {

    let result = null;
    const findByIdFn = (findId: string, findGroupModel: DynamicFormControlModel[], findArrayIndex): void => {

      for (const controlModel of findGroupModel) {

        if (controlModel.id === findId) {

          if (this.isArrayGroup(controlModel) && isNotNull(findArrayIndex)) {
            result = (controlModel as DynamicFormArrayModel).get(findArrayIndex);
          } else {
            result = controlModel;
          }
          break;
        }

        if (this.isConcatGroup(controlModel)) {
          if (controlModel.id.match(new RegExp(findId + CONCAT_GROUP_SUFFIX)) || controlModel.id.match(new RegExp(findId + CONCAT_GROUP_SUFFIX + `_\\d+$`))) {
            result = (controlModel as DynamicConcatModel);
            break;
          }
        }

        if (this.isGroup(controlModel)) {
          findByIdFn(findId, (controlModel as DynamicFormGroupModel).group, findArrayIndex);
        }

        if (this.isArrayGroup(controlModel)
          && (isNull(findArrayIndex) || (controlModel as DynamicFormArrayModel).size > (findArrayIndex))) {
          const index = (isNull(findArrayIndex)) ? 0 : findArrayIndex;
          findByIdFn(findId, (controlModel as DynamicFormArrayModel).get(index).group, index);
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

  getValueFromModel(groupModel: DynamicFormControlModel[]): any {
    let result = Object.create({});
    const customizer = (objValue, srcValue) => {
      if (Array.isArray(objValue)) {
        return objValue.concat(srcValue);
      }
    };

    const normalizeValue = (controlModel, controlValue, controlModelIndex) => {
      let securityLevel = null;
      let controlLanguage = (controlModel as DsDynamicInputModel).hasLanguages ? (controlModel as DsDynamicInputModel).language : null;
      if (controlModel instanceof DynamicQualdropModel) {
        // get the security value inside in the metadataValue of input
        if (controlModel.group) {
          controlModel.group.map((formModelDynamic: any) => {
            if (formModelDynamic.metadataValue) {
              if (formModelDynamic.metadataValue.securityLevel !== undefined) {
                securityLevel = formModelDynamic.metadataValue.securityLevel;
              }
            } else {
              if (formModelDynamic.value) {
                if (typeof formModelDynamic.value !== 'string') {
                  if (formModelDynamic.value.securityLevel !== undefined) {
                    securityLevel = formModelDynamic.value.securityLevel;
                  }
                }
              }
            }
            if (!formModelDynamic.metadataValue && formModelDynamic.value && typeof formModelDynamic.value === 'string') {
              if (formModelDynamic.securityLevel !== undefined) {
                securityLevel = formModelDynamic.securityLevel;
              }
            }
          });
        }

        let qualdropLanguageControl = null;
        for (const control of controlModel.group) {
          if (hasValue((control as DsDynamicInputModel).language)) {
            qualdropLanguageControl = control as DsDynamicInputModel;
            break;
          }
        }
        if (qualdropLanguageControl) {
          controlModel.language = controlLanguage ?? qualdropLanguageControl.language;
          controlLanguage = controlModel.language;
        }
      }
      if (controlModel && (controlModel as any).securityLevel !== undefined) {
        securityLevel = (controlModel as any).securityLevel;
      } else {
        if (controlValue && (controlValue as any).securityLevel !== undefined) {
          securityLevel = (controlValue as any).securityLevel;
        } else {
          if (controlModel && controlModel.metadataValue && controlModel.metadataValue.securityLevel !== undefined) {
            securityLevel = controlModel.metadataValue.securityLevel;
          }
        }
      }

      if (controlModel?.metadataValue?.authority?.includes(VIRTUAL_METADATA_PREFIX)) {
        return controlModel.metadataValue;
      }
      if (isString(controlValue)) {
        const lang = controlModel instanceof DynamicQualdropModel ? controlModel.language : controlLanguage;
        return new FormFieldMetadataValueObject(controlValue, lang, securityLevel, null, controlModelIndex);
      } else if (isNgbDateStruct(controlValue)) {
        return new FormFieldMetadataValueObject(dateToString(controlValue));
      } else if (isObject(controlValue)) {
        const authority = (controlValue as any).authority || (controlValue as any).id || null;
        const place = controlModelIndex || (controlValue as any).place;
        if (isNgbDateStruct(controlValue)) {
          return new FormFieldMetadataValueObject(controlValue, controlLanguage, securityLevel, authority, controlValue as any, place);
        } else {
          return new FormFieldMetadataValueObject((controlValue as any).value, controlLanguage, securityLevel, authority, (controlValue as any).display, place, (controlValue as any).confidence);
        }
      }
    };

    const iterateControlModels = (findGroupModel: DynamicFormControlModel[], controlModelIndex: number = 0): DynamicFormControlModel => {
      let iterateResult = Object.create({});
      // Iterate over all group's controls
      for (const controlModel of findGroupModel) {
        if ((controlModel as any).securityLevel !== undefined && (controlModel as any).securityLevel != null) {
          if ((controlModel as any).value) {
            if (typeof ((controlModel as any).value) === 'string') {
              if ((controlModel as any).metadataValue) {
                (controlModel as any).metadataValue = new FormFieldMetadataValueObject(
                  (controlModel as any).metadataValue.value,
                  (controlModel as any).metadataValue.language,
                  (controlModel as any).securityLevel,
                  (controlModel as any).metadataValue.authority,
                  (controlModel as any).metadataValue.display,
                  (controlModel as any).metadataValue.place,
                  (controlModel as any).metadataValue.confidence,
                  (controlModel as any).metadataValue.otherInformation,
                  (controlModel as any).metadataValue.source,
                  (controlModel as any).metadataValue.metadata);
              }

            } else {
              if (((controlModel as any).value) instanceof FormFieldMetadataValueObject) {
                (controlModel as any).value = new FormFieldMetadataValueObject(
                  (controlModel as any).value.value,
                  (controlModel as any).value.language,
                  (controlModel as any).securityLevel,
                  (controlModel as any).value.authority,
                  (controlModel as any).value.display,
                  (controlModel as any).value.place,
                  (controlModel as any).value.confidence,
                  (controlModel as any).value.otherInformation,
                  (controlModel as any).value.source,
                  (controlModel as any).value.metadata);
              }
            }
          }
        }


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
        const controlArrayValue = [];
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
          // Normalize control value as an array of FormFieldMetadataValueObject
          const values = Array.isArray((controlModel as any).value) ? (controlModel as any).value : [(controlModel as any).value];
          values.forEach((controlValue, pos) => {
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
                         isInnerForm = false, securityConfig: any = null, setTypeBind: boolean = true): DynamicFormControlModel[] | never {
     let rows: DynamicFormControlModel[] = [];
     const rawData = typeof json === 'string' ? JSON.parse(json, parseReviver) : json;
    if (rawData.rows && !isEmpty(rawData.rows)) {
      rawData.rows.forEach((currentRow) => {
        const rowParsed = this.rowParser.parse(submissionId, currentRow, scopeUUID, sectionData, submissionScope,
          readOnly, this.getTypeField(), isInnerForm, securityConfig);
        if (isNotNull(rowParsed)) {
          if (Array.isArray(rowParsed)) {
            rows = rows.concat(rowParsed);
          } else {
            rows.push(rowParsed);
          }
        }
      });
    }

    if (setTypeBind) {
      if (hasNoValue(typeBindModel)) {
        typeBindModel = this.findById(this.typeField, rows);
      }

      if (hasValue(typeBindModel)) {
        this.setTypeBindModel(typeBindModel);
      }
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

  isScrollableDropdown(model: DynamicFormControlModel): boolean {
    return model && (model.type === DYNAMIC_FORM_CONTROL_TYPE_SCROLLABLE_DROPDOWN);
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
   * Add new form model to formModels map
   * @param id id of model
   * @param model model
   */
  addFormModel(id: string, model: DynamicFormControlModel[]): void {
    this.formModels.set(id, model);
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
   * This method searches a field in all forms instantiated
   * by form.component and, if found, it updates its value
   *
   * @param fieldId id of field to update
   * @param value new value to set
   * @return the model updated if found
   */
  updateModelValue(fieldId: string, value: FormFieldMetadataValueObject): DynamicFormControlModel {
    let returnModel = null;
    [...this.formModels.keys()].forEach((formId) => {
      const models = this.formModels.get(formId);
      let fieldModel: any = this.findById(fieldId, models);
      if (hasValue(fieldModel) && !fieldModel.hidden) {
        const isIterable = (typeof value[Symbol.iterator] === 'function');
        if (isNotEmpty(value)) {
          if (fieldModel.repeatable && isNotEmpty(fieldModel.value) && !(!isIterable && fieldModel instanceof DynamicRelationGroupModel)) {
            // if model is repeatable and has already a value add a new field instead of replacing it
            const formGroup = this.formGroups.get(formId);
            const arrayContext = fieldModel.parent?.context;
            if (isNotEmpty(formGroup) && isNotEmpty(arrayContext)) {
              const formArrayControl = this.getFormControlByModel(formGroup, arrayContext) as FormArray;
              const index = arrayContext?.groups?.length;
              this.insertFormArrayGroup(index, formArrayControl, arrayContext);
              const newAddedModel: any = this.findById(fieldId, models, index);
              this.detectChanges();
              newAddedModel.value = value;
              returnModel = newAddedModel;
            }
          } else {
            if ((!isIterable && fieldModel instanceof DynamicRelationGroupModel) && isEmpty(fieldModel.value)) {
              const config: DynamicRelationGroupModelConfig = {
                submissionId: fieldModel.submissionId,
                formConfiguration: fieldModel.formConfiguration,
                isInlineGroup: fieldModel.isInlineGroup,
                mandatoryField: fieldModel.mandatoryField,
                relationFields: fieldModel.relationFields,
                scopeUUID: fieldModel.scopeUUID,
                submissionScope: fieldModel.submissionScope,
                repeatable: fieldModel.repeatable,
                metadataFields: fieldModel.metadataFields,
                hasSelectableMetadata: fieldModel.hasSelectableMetadata,
                id: fieldModel.id,
                value: fieldModel.getGroupValue(value)
              };
              fieldModel = new DynamicRelationGroupModel(config);
            } else {
              fieldModel.value =  value;
            }
            returnModel = fieldModel;

          }
        }
      }
    });
    return returnModel;
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
  setTypeBindFieldFromConfig(): void {
    this.configService.findByPropertyName('submit.type-bind.field').pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((remoteData: any) => {
      // make sure we got a success response from the backend
      if (!remoteData.hasSucceeded) {
        this.typeField = 'dc_type';
        return;
      }
      // Read type bind value from response and set if non-empty
      const typeFieldConfig = remoteData.payload.values[0];
      if (isEmpty(typeFieldConfig)) {
        this.typeField = 'dc_type';
      } else {
        this.typeField = typeFieldConfig.replace(/\./g, '_');
      }
    });
  }

  /**
   * Get type field. If the type isn't already set, and a ConfigurationDataService is provided, set (with subscribe)
   * from back end. Otherwise, get/set a default "dc_type" value
   */
  getTypeField(): string {
    if (hasValue(this.configService) && hasNoValue(this.typeField)) {
      this.setTypeBindFieldFromConfig();
    } else if (hasNoValue(this.typeField)) {
      this.typeField = 'dc_type';
    }
    return this.typeField;
  }

  /**
   * Add new formbuilder in forma array by copying current formBuilder index
   * @param index index of formBuilder selected to be copied
   * @param formArray formArray of the inline group forms
   * @param formArrayModel formArrayModel model of forms that will be created
   */
  copyFormArrayGroup(index: number, formArray: FormArray, formArrayModel: DynamicFormArrayModel) {

      const groupModel = formArrayModel.insertGroup(index);
      const previousGroup = formArray.controls[index] as UntypedFormGroup;
      const newGroup = this.createFormGroup(groupModel.group, null, groupModel);
      const previousKey = Object.keys(previousGroup.getRawValue())[0];
      const newKey = Object.keys(newGroup.getRawValue())[0];
      const rawValue = previousGroup.getRawValue()[previousKey];
      if (!isObjectEmpty(rawValue)) {
        newGroup.get(newKey).patchValue(rawValue);
      }

      formArray.insert(index, newGroup);

      return newGroup;
  }



}
