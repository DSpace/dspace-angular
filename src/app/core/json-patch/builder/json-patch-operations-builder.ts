import { Store } from '@ngrx/store';
import {
  NewPatchAddOperationAction,
  NewPatchMoveOperationAction,
  NewPatchRemoveOperationAction,
  NewPatchReplaceOperationAction
} from '../json-patch-operations.actions';
import { JsonPatchOperationPathObject } from './json-patch-operation-path-combiner';
import { Injectable } from '@angular/core';
import { hasNoValue, hasValue, isEmpty, isNotEmpty } from '../../../shared/empty.util';
import { dateToISOFormat, dateToString, isNgbDateStruct } from '../../../shared/date.util';
import { VocabularyEntry } from '../../submission/vocabularies/models/vocabulary-entry.model';
import { FormFieldMetadataValueObject } from '../../../shared/form/builder/models/form-field-metadata-value.model';
import { FormFieldLanguageValueObject } from '../../../shared/form/builder/models/form-field-language-value.model';
import { CoreState } from '../../core-state.model';

/**
 * Provides methods to dispatch JsonPatch Operations Actions
 */
@Injectable()
export class JsonPatchOperationsBuilder {

  constructor(private store: Store<CoreState>) {
  }

  /**
   * Dispatches a new NewPatchAddOperationAction
   *
   * @param path
   *    a JsonPatchOperationPathObject representing path
   * @param value
   *    The value to update the referenced path
   * @param first
   *    A boolean representing if the value to be added is the first of an array
   * @param plain
   *    A boolean representing if the value to be added is a plain text value
   */
  add(path: JsonPatchOperationPathObject, value, first = false, plain = false) {
    this.store.dispatch(
      new NewPatchAddOperationAction(
        path.rootElement,
        path.subRootElement,
        path.path, this.prepareValue(value, plain, first)));
  }

  /**
   * Dispatches a new NewPatchReplaceOperationAction
   *
   * @param path
   *    a JsonPatchOperationPathObject representing path
   * @param value
   *    the value to update the referenced path
   * @param plain
   *    a boolean representing if the value to be added is a plain text value
   * @param securityLevel
   */
  replace(path: JsonPatchOperationPathObject, value, plain = false, securityLevel = null) {
    if (hasNoValue(value) || (typeof value === 'object' && hasNoValue(value.value))) {
      this.remove(path);
    } else {
      this.store.dispatch(
        new NewPatchReplaceOperationAction(
          path.rootElement,
          path.subRootElement,
          path.path,
          this.prepareValue(value, plain, false, securityLevel)));
    }
  }

  /**
   * Dispatch a new NewPatchMoveOperationAction
   *
   * @param path
   *    the new path tho move to
   * @param prevPath
   *    the original path to move from
   */
  move(path: JsonPatchOperationPathObject, prevPath: string) {
    this.store.dispatch(
      new NewPatchMoveOperationAction(
        path.rootElement,
        path.subRootElement,
        prevPath,
        path.path
      )
    );
  }

  /**
   * Dispatches a new NewPatchRemoveOperationAction
   *
   * @param path
   *    a JsonPatchOperationPathObject representing path
   */
  remove(path: JsonPatchOperationPathObject) {
    this.store.dispatch(
      new NewPatchRemoveOperationAction(
        path.rootElement,
        path.subRootElement,
        path.path));
  }

  protected prepareValue(value: any, plain: boolean, first: boolean, securityLevel = null) {
      let operationValue: any = null;
    if (hasValue(value)) {
      if (plain) {
        operationValue = value;
      } else {
        if (Array.isArray(value)) {
          operationValue = [];
          value.forEach((entry) => {
            if ((typeof entry === 'object')) {
              if (securityLevel != null) {
                operationValue.push(this.prepareObjectValue(entry, securityLevel));
              } else {
                operationValue.push(this.prepareObjectValue(entry));
              }

            } else {
              operationValue.push(new FormFieldMetadataValueObject(entry, null, securityLevel));
            }
          });
        } else if (typeof value === 'object') {
          if (securityLevel != null) {
            operationValue = this.prepareObjectValue(value, securityLevel);
          } else {
            operationValue = this.prepareObjectValue(value);
          }

        } else {
          // add the possibility to add security level when value is string
          // in this case security level is set on metadata value
          if (securityLevel != null) {
            operationValue = new FormFieldMetadataValueObject(value, null, securityLevel);
          } else  {
            operationValue = new FormFieldMetadataValueObject(value, null);
          }

        }
      }
    }
    return (first && !Array.isArray(operationValue)) ? [operationValue] : operationValue;
  }

  protected prepareObjectValue(value: any, securityLevel = null) {
     let operationValue = Object.create({});
    if (isEmpty(value) || value instanceof FormFieldMetadataValueObject) {
      if (securityLevel != null) {
      operationValue = {...value, securityLevel: securityLevel};
      } else  {
        operationValue = value;
      }
    } else if (value instanceof Date) {
      if (securityLevel != null) {
      operationValue = new FormFieldMetadataValueObject(dateToISOFormat(value), null, securityLevel);
      } else {
        operationValue = new FormFieldMetadataValueObject(dateToISOFormat(value));
      }
    } else if (value instanceof VocabularyEntry) {
      operationValue = this.prepareAuthorityValue(value);
    } else if (value instanceof FormFieldLanguageValueObject) {
      operationValue = new FormFieldMetadataValueObject(value.value, value.language, securityLevel);
    } else if (value.hasOwnProperty('authority')) {
      operationValue = new FormFieldMetadataValueObject(value.value, value.language, value.securityLevel, value.authority);
    } else if (isNgbDateStruct(value)) {
      operationValue = new FormFieldMetadataValueObject(dateToString(value), null, securityLevel);
    } else if (value.hasOwnProperty('value')) {
      operationValue = new FormFieldMetadataValueObject(value.value, null, value.securityLevel);
    } else {
      Object.keys(value)
        .forEach((key) => {
          if (typeof value[key] === 'object') {
            if (securityLevel != null) {
            operationValue[key] = this.prepareObjectValue(value[key], securityLevel);
            } else {
 operationValue[key] = this.prepareObjectValue(value[key]);

            }
          } else {
            operationValue[key] = value[key];
          }
        });
    }
    return operationValue;
  }

  protected prepareAuthorityValue(value: any): FormFieldMetadataValueObject {
    let operationValue: FormFieldMetadataValueObject;
    if (isNotEmpty(value.authority)) {
      operationValue = new FormFieldMetadataValueObject(value.value, value.language, value.securityLevel, value.authority);
    } else {
      operationValue = new FormFieldMetadataValueObject(value.value, value.language, value.securityLevel,);
    }
    return operationValue;
  }

}
