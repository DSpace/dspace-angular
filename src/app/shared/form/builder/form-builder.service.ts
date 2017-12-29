import { Injectable } from '@angular/core';
import { isEqual, uniqueId } from 'lodash';

import {
  DYNAMIC_FORM_CONTROL_TYPE_ARRAY,
  DYNAMIC_FORM_CONTROL_TYPE_GROUP, DynamicCheckboxModel,
  DynamicFormArrayGroupModel,
  DynamicFormArrayModel,
  DynamicFormControlEvent,
  DynamicFormControlModel,
  DynamicFormGroupModel, DynamicFormGroupModelConfig,
  DynamicFormService,
  DynamicFormValidationService,
  DynamicPathable,
  Utils
} from '@ng-dynamic-forms/core';

import { DateFieldParser } from './parsers/date-field-parser';
import { DropdownFieldParser } from './parsers/dropdown-field-parser';
import { TextareaFieldParser } from './parsers/textarea-field-parser';
import { ListFieldParser } from './parsers/list-field-parser';
import { OneboxFieldParser } from './parsers/onebox-field-parser';
import { IntegrationSearchOptions } from '../../../core/integration/models/integration-options.model';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  isEmpty,
  isNotEmpty,
  isNotNull,
  isNotUndefined,
  isNull,
  isUndefined
} from '../../empty.util';
import {
  COMBOBOX_GROUP_SUFFIX,
  COMBOBOX_METADATA_SUFFIX, COMBOBOX_VALUE_SUFFIX,
  DynamicComboboxModel
} from './ds-dynamic-form-ui/models/ds-dynamic-combobox.model';
import { DynamicTypeaheadModel } from './ds-dynamic-form-ui/models/typeahead/dynamic-typeahead.model';
import { DynamicScrollableDropdownModel } from './ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { SubmissionFormsModel } from '../../../core/shared/config/config-submission-forms.model';
import { AuthorityModel } from '../../../core/integration/models/authority.model';
import { TagFieldParser } from './parsers/tag-field-parser';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { FormFieldPreviousValueObject } from './models/form-field-previous-value-object';
import { DynamicRelationGroupModel } from './ds-dynamic-form-ui/models/ds-dynamic-relation-group-model';
import {
 DynamicConcatModel, NAME_INPUT_1_SUFFIX, NAME_INPUT_2_SUFFIX,

  SERIES_INPUT_1_SUFFIX, SERIES_INPUT_2_SUFFIX
} from './ds-dynamic-form-ui/models/ds-dynamic-concat.model';
import { AuthorityService } from '../../../core/integration/authority.service';
import { SeriesFieldParser } from './parsers/series-field-parser';
import { DynamicListCheckboxGroupModel } from './ds-dynamic-form-ui/models/list/dynamic-list-checkbox-group.model';
import { DsDynamicListComponent } from './ds-dynamic-form-ui/models/list/dynamic-list.component';
import { NameFieldParser } from './parsers/name-field-parser';
import {DynamicTagModel} from './ds-dynamic-form-ui/models/tag/dynamic-tag.model';

@Injectable()
export class FormBuilderService extends DynamicFormService {

  protected authorityOptions: IntegrationSearchOptions;

  constructor(formBuilder: FormBuilder,
              validationService: DynamicFormValidationService,
              private operationsBuilder: JsonPatchOperationsBuilder,
              private authorityService: AuthorityService) {
    super(formBuilder, validationService);
  }

  findById(id: string, groupModel: DynamicFormControlModel[], arrayIndex = null): DynamicFormControlModel | null {

    let result = null;
    const findByIdFn = (findId: string, findGroupModel: DynamicFormControlModel[]): void => {

      for (const controlModel of findGroupModel) {

        if (controlModel.id === findId) {
          if (controlModel instanceof DynamicFormArrayModel && isNotNull(arrayIndex)) {
            result = controlModel.get(arrayIndex)
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

  modelFromConfiguration(json: string | SubmissionFormsModel, initFormValues: any, isGroup: boolean = false): DynamicFormControlModel[] | never {
    const rows: DynamicFormControlModel[] = [];
    const rawData = Utils.isString(json) ? JSON.parse(json as string, Utils.parseJSONReviver) : json;

    if (rawData.rows && !isEmpty(rawData.rows)) {
      rawData.rows.forEach((currentRow) => {
        let fieldModel: any = null;
        const config: DynamicFormGroupModelConfig = {
          id: uniqueId('df-row-group-config-'),
          group: [],
        };

        const clsGridClass = ' col-sm-' + Math.trunc(12 / currentRow.fields.length);

        currentRow.fields.forEach((fieldData) => {

          switch (fieldData.input.type) {
            case 'date':
              fieldModel = (new DateFieldParser(fieldData, initFormValues).parse());
              break;

            case 'dropdown':
                  fieldModel = (new DropdownFieldParser(fieldData, initFormValues, this.authorityOptions.uuid).parse());
                  break;

            case 'list':
              fieldModel = (new ListFieldParser(fieldData, initFormValues, this.authorityOptions.uuid).parse());
              break;

            case 'lookup':
              fieldModel = (new OneboxFieldParser(fieldData, initFormValues, this.authorityOptions.uuid).parse());
              break;

            case 'onebox':
              fieldModel = (new OneboxFieldParser(fieldData, initFormValues, this.authorityOptions.uuid).parse());
              break;

            case 'lookup-name':
              // group.push(new NameFieldParser(fieldData).parse());
              break;

            case 'name':
              fieldModel = (new NameFieldParser(fieldData, initFormValues).parse());
              break;

            case 'series':
              fieldModel = (new SeriesFieldParser(fieldData, initFormValues).parse());
              break;

            case 'tag':
              fieldModel = (new TagFieldParser(fieldData, initFormValues, this.authorityOptions.uuid).parse());
              break;

            case 'textarea':
              fieldModel = (new TextareaFieldParser(fieldData, initFormValues).parse());
              break;

            case 'group':
              fieldModel = this.modelFromConfiguration(fieldData, initFormValues, true);
              break;

            case 'twobox':
              // group.push(new TwoboxFieldParser(fieldData).parse());
              break;

            default:
              throw new Error(`unknown form control model type defined on JSON object with label "${fieldData.label}"`);
          }

          if (fieldModel) {
            if (fieldModel instanceof DynamicFormArrayModel) {
              rows.push(fieldModel);
            } else {
              if (fieldModel instanceof Array) {
                fieldModel.forEach((model) => {
                  rows.push(model);
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
          rows.push(isGroup ? new DynamicRelationGroupModel(config) : new DynamicFormGroupModel(config, clsGroup));
        }
      });
    }

    return rows;
  }

  hasAuthorityValue(fieldModel) {
    return (fieldModel instanceof DynamicTypeaheadModel || fieldModel instanceof DynamicScrollableDropdownModel);
  }

  setAuthorityUuid(uuid: string) {
    this.authorityOptions = new IntegrationSearchOptions(uuid);
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
      fieldId = event.model.parent.path;
    } else {
      fieldId = this.getId(event.model);
    }
    return fieldId;
  }

  getFieldValueFromChangeEvent(event: DynamicFormControlEvent) {
    let fieldValue;
    if (this.isModelInCustomGroup(event.model)) {
      fieldValue = (event.model.parent as any).value;
    }else {
      fieldValue = (event.model as  any).value;
    } /*else if (isNotEmpty(event.control.value)
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

  isModelInCustomGroup(model: DynamicFormControlModel) {
    return model.parent &&
      (model.parent instanceof DynamicConcatModel
        || model.parent instanceof DynamicComboboxModel);
  }

  isModelInAuthorityGroup(model: DynamicFormControlModel) {
    return (model instanceof DynamicListCheckboxGroupModel);
  }

  getFormControlById(id: string, formGroup: FormGroup, groupModel: DynamicFormControlModel[], index = 0) {
    const fieldModel = this.findById(id, groupModel, index);
    return isNotEmpty(fieldModel) ? formGroup.get(this.getPath(fieldModel)) : null;
  }

  getId(model: DynamicPathable) {
    if (model instanceof DynamicFormArrayGroupModel) {
      return model.index.toString()
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
      this.dispatchComboboxOperations(pathCombiner, event, previousValue);
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
      this.dispatchComboboxOperations(pathCombiner, event, previousValue);
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
      const metadataValueList = metadataValueMap.get(groupModel.path) ? metadataValueMap.get(groupModel.path) : [];
      if (groupModel.value) {
        metadataValueList.push(groupModel.value);
        metadataValueMap.set(groupModel.path, metadataValueList);
      }
    });

    return metadataValueMap;
  }

  protected dispatchComboboxOperations(pathCombiner: JsonPatchOperationPathCombiner,
                                       event: DynamicFormControlEvent,
                                       previousValue: FormFieldPreviousValueObject) {
    const currentValueMap = this.getComboboxMap(event);
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
