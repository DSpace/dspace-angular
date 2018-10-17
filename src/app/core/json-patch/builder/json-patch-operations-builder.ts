import { Store } from '@ngrx/store';
import { CoreState } from '../../core.reducers';
import {
  NewPatchAddOperationAction,
  NewPatchRemoveOperationAction,
  NewPatchReplaceOperationAction
} from '../json-patch-operations.actions';
import { JsonPatchOperationPathObject } from './json-patch-operation-path-combiner';
import { Injectable } from '@angular/core';
import { isEmpty, isNotEmpty } from '../../../shared/empty.util';
import { dateToGMTString } from '../../../shared/date.util';
import { AuthorityValue } from '../../integration/models/authority.value';
import { FormFieldMetadataValueObject } from '../../../shared/form/builder/models/form-field-metadata-value.model';
import { FormFieldLanguageValueObject } from '../../../shared/form/builder/models/form-field-language-value.model';

@Injectable()
export class JsonPatchOperationsBuilder {

  constructor(private store: Store<CoreState>) {
  }

  add(path: JsonPatchOperationPathObject, value, first = false, plain = false) {
    this.store.dispatch(
      new NewPatchAddOperationAction(
        path.rootElement,
        path.subRootElement,
        path.path, this.prepareValue(value, plain, first)));
  }

  replace(path: JsonPatchOperationPathObject, value, plain = false) {
    this.store.dispatch(
      new NewPatchReplaceOperationAction(
        path.rootElement,
        path.subRootElement,
        path.path,
        this.prepareValue(value, plain, false)));
  }

  remove(path: JsonPatchOperationPathObject) {
    this.store.dispatch(
      new NewPatchRemoveOperationAction(
        path.rootElement,
        path.subRootElement,
        path.path));
  }

  protected prepareValue(value: any, plain: boolean, first: boolean) {
    let operationValue: any = null;
    if (isNotEmpty(value)) {
      if (plain) {
        operationValue = value;
      } else {
        if (Array.isArray(value)) {
          operationValue = [];
          value.forEach((entry) => {
            if ((typeof entry === 'object')) {
              operationValue.push(this.prepareObjectValue(entry));
            } else {
              operationValue.push(new FormFieldMetadataValueObject(entry));
              // operationValue.push({value: entry});
              // operationValue.push(entry);
            }
          });
        } else if (typeof value === 'object') {
          operationValue = this.prepareObjectValue(value);
        } else {
          operationValue = new FormFieldMetadataValueObject(value);
        }
      }
    }
    return (first && !Array.isArray(operationValue)) ? [operationValue] : operationValue;
  }

  protected prepareObjectValue(value: any) {
    let operationValue = Object.create({});
    if (isEmpty(value) || value instanceof FormFieldMetadataValueObject) {
      operationValue = value;
    } else if (value instanceof Date) {
      operationValue = new FormFieldMetadataValueObject(dateToGMTString(value));
    } else if (value instanceof AuthorityValue) {
      operationValue = this.prepareAuthorityValue(value);
    } else if (value instanceof FormFieldLanguageValueObject) {
      operationValue = new FormFieldMetadataValueObject(value.value, value.language);
    } else if (value.hasOwnProperty('value')) {
      operationValue = new FormFieldMetadataValueObject(value.value);
      // operationValue = value;
    } else {
      Object.keys(value)
        .forEach((key) => {
          if (typeof value[key] === 'object') {
            operationValue[key] = this.prepareObjectValue(value[key]);
          } else {
            operationValue[key] = value[key];
          }
        });
      // operationValue = {value: value};
    }
    return operationValue;
  }

  protected prepareAuthorityValue(value: any) {
    let operationValue: any = null;
    if (isNotEmpty(value.id)) {
      operationValue = new FormFieldMetadataValueObject(value.value, value.language, value.id);
    } else {
      operationValue = new FormFieldMetadataValueObject(value.value, value.language);
    }
    return operationValue;
  }

}
