import { Store } from '@ngrx/store';
import { CoreState } from '../../core.reducers';
import {
  NewPatchAddOperationAction, NewPatchRemoveOperationAction,
  NewPatchReplaceOperationAction
} from '../json-patch-operations.actions';
import { JsonPatchOperationPathObject } from './json-patch-operation-path-combiner';
import { Injectable } from '@angular/core';
import { isNotEmpty } from '../../../shared/empty.util';
import { dateToGMTString } from '../../../shared/date.util';
import { AuthorityModel } from '../../integration/models/authority.model';

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
              operationValue.push({value: entry});
            }
          })
        } else if (typeof value === 'object') {
          operationValue = this.prepareObjectValue(value);
        } else {
          operationValue = {value: value};
        }
      }
    }
    return (first && !Array.isArray(operationValue)) ? [operationValue] : operationValue;
  }

  protected prepareObjectValue(value: any) {
    let operationValue = Object.create(null);
    if (value instanceof Date) {
      operationValue = dateToGMTString(value);
    } else if (value instanceof AuthorityModel) {
      operationValue = this.prepareAuthorityValue(value);
    } else if (value.hasOwnProperty('value')) {
      operationValue = value;
    } else {
      Object.keys(value)
        .forEach((key) => {
          if (typeof value[key] === 'object') {
            operationValue[key] = this.prepareObjectValue(value[key]);
          } else {
            operationValue[key] = value[key];
          }
        })
      // operationValue = {value: value};
    }
    return operationValue;
  }

  protected prepareAuthorityValue(value: any) {
    let operationValue: any = null;
    if (isNotEmpty(value.id)) {
      operationValue = { value: value.value, authority: value.id, confidence: 600 };
    } else {
      operationValue = { value: value.value };
    }
    return operationValue
  }

}
