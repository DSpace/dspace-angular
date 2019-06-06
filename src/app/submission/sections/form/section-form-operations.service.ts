import { Injectable } from '@angular/core';

import { isEqual, isObject } from 'lodash';
import {
  DYNAMIC_FORM_CONTROL_TYPE_ARRAY,
  DYNAMIC_FORM_CONTROL_TYPE_GROUP,
  DynamicFormArrayGroupModel,
  DynamicFormControlEvent,
  DynamicFormControlModel
} from '@ng-dynamic-forms/core';

import { isNotEmpty, isNotNull, isNotUndefined, isNull, isUndefined } from '../../../shared/empty.util';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { FormFieldPreviousValueObject } from '../../../shared/form/builder/models/form-field-previous-value-object';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { FormFieldLanguageValueObject } from '../../../shared/form/builder/models/form-field-language-value.model';
import { DsDynamicInputModel } from '../../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-input.model';
import { AuthorityValue } from '../../../core/integration/models/authority.value';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { FormFieldMetadataValueObject } from '../../../shared/form/builder/models/form-field-metadata-value.model';
import { DynamicQualdropModel } from '../../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-qualdrop.model';
import { DynamicRelationGroupModel } from '../../../shared/form/builder/ds-dynamic-form-ui/models/relation-group/dynamic-relation-group.model';

/**
 * The service handling all form section operations
 */
@Injectable()
export class SectionFormOperationsService {

  /**
   * Initialize service variables
   *
   * @param {FormBuilderService} formBuilder
   * @param {JsonPatchOperationsBuilder} operationsBuilder
   */
  constructor(
    private formBuilder: FormBuilderService,
    private operationsBuilder: JsonPatchOperationsBuilder) {
  }

  /**
   * Dispatch properly method based on form operation type
   *
   * @param pathCombiner
   *    the [[JsonPatchOperationPathCombiner]] object for the specified operation
   * @param event
   *    the [[DynamicFormControlEvent]] for the specified operation
   * @param previousValue
   *    the [[FormFieldPreviousValueObject]] for the specified operation
   * @param hasStoredValue
   *    representing if field value related to the specified operation has stored value
   */
  public dispatchOperationsFromEvent(pathCombiner: JsonPatchOperationPathCombiner,
                                     event: DynamicFormControlEvent,
                                     previousValue: FormFieldPreviousValueObject,
                                     hasStoredValue: boolean): void {
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

  /**
   * Return index if specified field is part of fields array
   *
   * @param event
   *    the [[DynamicFormControlEvent]] for the specified operation
   * @return number
   *    the array index is part of array, zero otherwise
   */
  public getArrayIndexFromEvent(event: DynamicFormControlEvent): number {
    let fieldIndex: number;
    if (isNotEmpty(event)) {
      if (isNull(event.context)) {
        // Check whether model is part of an Array of group
        if (this.isPartOfArrayOfGroup(event.model)) {
          fieldIndex = (event.model.parent as any).parent.index;
        }
      } else {
        fieldIndex = event.context.index;
      }
    }

    // if field index is undefined model is not part of array of fields
    return isNotUndefined(fieldIndex) ? fieldIndex : 0;
  }

  /**
   * Check if specified model is part of array of group
   *
   * @param model
   *    the [[DynamicFormControlModel]] model
   * @return boolean
   *    true if is part of array, false otherwise
   */
  public isPartOfArrayOfGroup(model: DynamicFormControlModel): boolean {
    return (isNotNull(model.parent)
      && (model.parent as any).type === DYNAMIC_FORM_CONTROL_TYPE_GROUP
      && (model.parent as any).parent
      && (model.parent as any).parent.context
      && (model.parent as any).parent.context.type === DYNAMIC_FORM_CONTROL_TYPE_ARRAY);
  }

  /**
   * Return a map for the values of a Qualdrop field
   *
   * @param event
   *    the [[DynamicFormControlEvent]] for the specified operation
   * @return Map<string, any>
   *    the map of values
   */
  public getQualdropValueMap(event: DynamicFormControlEvent): Map<string, any> {
    const metadataValueMap = new Map();

    const context = this.formBuilder.isQualdropGroup(event.model)
      ? (event.model.parent as DynamicFormArrayGroupModel).context
      : (event.model.parent.parent as DynamicFormArrayGroupModel).context;

    context.groups.forEach((arrayModel: DynamicFormArrayGroupModel) => {
      const groupModel = arrayModel.group[0] as DynamicQualdropModel;
      const metadataValueList = metadataValueMap.get(groupModel.qualdropId) ? metadataValueMap.get(groupModel.qualdropId) : [];
      if (groupModel.value) {
        metadataValueList.push(groupModel.value);
        metadataValueMap.set(groupModel.qualdropId, metadataValueList);
      }
    });

    return metadataValueMap;
  }

  /**
   * Return the absolute path for the field interesting in the specified operation
   *
   * @param event
   *    the [[DynamicFormControlEvent]] for the specified operation
   * @return string
   *    the field path
   */
  public getFieldPathFromEvent(event: DynamicFormControlEvent): string {
    const fieldIndex = this.getArrayIndexFromEvent(event);
    const fieldId = this.getFieldPathSegmentedFromChangeEvent(event);
    return (isNotUndefined(fieldIndex)) ? fieldId + '/' + fieldIndex : fieldId;
  }

  /**
   * Return the absolute path for the Qualdrop field interesting in the specified operation
   *
   * @param event
   *    the [[DynamicFormControlEvent]] for the specified operation
   * @return string
   *    the field path
   */
  public getQualdropItemPathFromEvent(event: DynamicFormControlEvent): string {
    const fieldIndex = this.getArrayIndexFromEvent(event);
    const metadataValueMap = new Map();
    let path = null;

    const context = this.formBuilder.isQualdropGroup(event.model)
      ? (event.model.parent as DynamicFormArrayGroupModel).context
      : (event.model.parent.parent as DynamicFormArrayGroupModel).context;

    context.groups.forEach((arrayModel: DynamicFormArrayGroupModel, index: number) => {
      const groupModel = arrayModel.group[0] as DynamicQualdropModel;
      const metadataValueList = metadataValueMap.get(groupModel.qualdropId) ? metadataValueMap.get(groupModel.qualdropId) : [];
      if (groupModel.value) {
        metadataValueList.push(groupModel.value);
        metadataValueMap.set(groupModel.qualdropId, metadataValueList);
      }
      if (index === fieldIndex) {
        path = groupModel.qualdropId + '/' + (metadataValueMap.get(groupModel.qualdropId).length - 1)
      }
    });

    return path;
  }

  /**
   * Return the segmented path for the field interesting in the specified change operation
   *
   * @param event
   *    the [[DynamicFormControlEvent]] for the specified operation
   * @return string
   *    the field path
   */
  public getFieldPathSegmentedFromChangeEvent(event: DynamicFormControlEvent): string {
    let fieldId;
    if (this.formBuilder.isQualdropGroup(event.model as DynamicFormControlModel)) {
      fieldId = (event.model as any).qualdropId;
    } else if (this.formBuilder.isQualdropGroup(event.model.parent as DynamicFormControlModel)) {
      fieldId = (event.model.parent as any).qualdropId;
    } else {
      fieldId = this.formBuilder.getId(event.model);
    }
    return fieldId;
  }

  /**
   * Return the value of the field interesting in the specified change operation
   *
   * @param event
   *    the [[DynamicFormControlEvent]] for the specified operation
   * @return any
   *    the field value
   */
  public getFieldValueFromChangeEvent(event: DynamicFormControlEvent): any {
    let fieldValue;
    const value = (event.model as any).value;

    if (this.formBuilder.isModelInCustomGroup(event.model)) {
      fieldValue = (event.model.parent as any).value;
    } else if (this.formBuilder.isRelationGroup(event.model)) {
      fieldValue = (event.model as DynamicRelationGroupModel).getGroupValue();
    } else if ((event.model as any).hasLanguages) {
      const language = (event.model as any).language;
      if ((event.model as DsDynamicInputModel).hasAuthority) {
        if (Array.isArray(value)) {
          value.forEach((authority, index) => {
            authority = Object.assign(new AuthorityValue(), authority, { language });
            value[index] = authority;
          });
          fieldValue = value;
        } else {
          fieldValue = Object.assign(new AuthorityValue(), value, { language });
        }
      } else {
        // Language without Authority (input, textArea)
        fieldValue = new FormFieldMetadataValueObject(value, language);
      }
    } else if (value instanceof FormFieldLanguageValueObject || value instanceof AuthorityValue || isObject(value)) {
      fieldValue = value;
    } else {
      fieldValue = new FormFieldMetadataValueObject(value);
    }

    return fieldValue;
  }

  /**
   * Return a map for the values of an array of field
   *
   * @param items
   *    the list of items
   * @return Map<string, any>
   *    the map of values
   */
  public getValueMap(items: any[]): Map<string, any> {
    const metadataValueMap = new Map();

    items.forEach((item) => {
      Object.keys(item)
        .forEach((key) => {
          const metadataValueList = metadataValueMap.get(key) ? metadataValueMap.get(key) : [];
          metadataValueList.push(item[key]);
          metadataValueMap.set(key, metadataValueList);
        });

    });
    return metadataValueMap;
  }

  /**
   * Handle form remove operations
   *
   * @param pathCombiner
   *    the [[JsonPatchOperationPathCombiner]] object for the specified operation
   * @param event
   *    the [[DynamicFormControlEvent]] for the specified operation
   * @param previousValue
   *    the [[FormFieldPreviousValueObject]] for the specified operation
   */
  protected dispatchOperationsFromRemoveEvent(pathCombiner: JsonPatchOperationPathCombiner,
                                              event: DynamicFormControlEvent,
                                              previousValue: FormFieldPreviousValueObject): void {
    const path = this.getFieldPathFromEvent(event);
    const value = this.getFieldValueFromChangeEvent(event);
    if (this.formBuilder.isQualdropGroup(event.model as DynamicFormControlModel)) {
      this.dispatchOperationsFromMap(this.getQualdropValueMap(event), pathCombiner, event, previousValue);
    } else if (isNotEmpty(value)) {
      this.operationsBuilder.remove(pathCombiner.getPath(path));
    }
  }

  /**
   * Handle form change operations
   *
   * @param pathCombiner
   *    the [[JsonPatchOperationPathCombiner]] object for the specified operation
   * @param event
   *    the [[DynamicFormControlEvent]] for the specified operation
   * @param previousValue
   *    the [[FormFieldPreviousValueObject]] for the specified operation
   * @param hasStoredValue
   *    representing if field value related to the specified operation has stored value
   */
  protected dispatchOperationsFromChangeEvent(pathCombiner: JsonPatchOperationPathCombiner,
                                              event: DynamicFormControlEvent,
                                              previousValue: FormFieldPreviousValueObject,
                                              hasStoredValue: boolean): void {
    const path = this.getFieldPathFromEvent(event);
    const segmentedPath = this.getFieldPathSegmentedFromChangeEvent(event);
    const value = this.getFieldValueFromChangeEvent(event);
    // Detect which operation must be dispatched
    if (this.formBuilder.isQualdropGroup(event.model.parent as DynamicFormControlModel)) {
      // It's a qualdrup model
      this.dispatchOperationsFromMap(this.getQualdropValueMap(event), pathCombiner, event, previousValue);
    } else if (this.formBuilder.isRelationGroup(event.model)) {
      // It's a relation model
      this.dispatchOperationsFromMap(this.getValueMap(value), pathCombiner, event, previousValue);
    } else if (this.formBuilder.hasArrayGroupValue(event.model)) {
      // Model has as value an array, so dispatch an add operation with entire block of values
      this.operationsBuilder.add(
        pathCombiner.getPath(segmentedPath),
        value, true);
    } else if (previousValue.isPathEqual(this.formBuilder.getPath(event.model)) || hasStoredValue) {
      // Here model has a previous value changed or stored in the server
      if (!value.hasValue()) {
        // New value is empty, so dispatch a remove operation
        if (this.getArrayIndexFromEvent(event) === 0) {
          this.operationsBuilder.remove(pathCombiner.getPath(segmentedPath));
        } else {
          this.operationsBuilder.remove(pathCombiner.getPath(path));
        }
      } else {
        // New value is not equal from the previous one, so dispatch a replace operation
        this.operationsBuilder.replace(
          pathCombiner.getPath(path),
          value);
      }
      previousValue.delete();
    } else if (value.hasValue()) {
      // Here model has no previous value but a new one
      if (isUndefined(this.getArrayIndexFromEvent(event))
        || this.getArrayIndexFromEvent(event) === 0) {
        // Model is single field or is part of an array model but is the first item,
        // so dispatch an add operation that initialize the values of a specific metadata
        this.operationsBuilder.add(
          pathCombiner.getPath(segmentedPath),
          value, true);
      } else {
        // Model is part of an array model but is not the first item,
        // so dispatch an add operation that add a value to an existent metadata
        this.operationsBuilder.add(
          pathCombiner.getPath(path),
          value);
      }
    }
  }

  /**
   * Handle form operations interesting a field with a map as value
   *
   * @param valueMap
   *    map of values
   * @param pathCombiner
   *    the [[JsonPatchOperationPathCombiner]] object for the specified operation
   * @param event
   *    the [[DynamicFormControlEvent]] for the specified operation
   * @param previousValue
   *    the [[FormFieldPreviousValueObject]] for the specified operation
   */
  protected dispatchOperationsFromMap(valueMap: Map<string, any>,
                                      pathCombiner: JsonPatchOperationPathCombiner,
                                      event: DynamicFormControlEvent,
                                      previousValue: FormFieldPreviousValueObject): void {
    const currentValueMap = valueMap;
    if (event.type === 'remove') {
      const path = this.getQualdropItemPathFromEvent(event);
      this.operationsBuilder.remove(pathCombiner.getPath(path));
    } else {
      if (previousValue.isPathEqual(this.formBuilder.getPath(event.model))) {
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
      currentValueMap.forEach((entry: any[], index) => {
        if (entry.length === 1 && isNull(entry[0])) {
          // The last item of the group has been deleted so make a remove op
          this.operationsBuilder.remove(pathCombiner.getPath(index));
        } else {
          this.operationsBuilder.add(pathCombiner.getPath(index), entry, true);
        }
      });
    }

    previousValue.delete();
  }
}
