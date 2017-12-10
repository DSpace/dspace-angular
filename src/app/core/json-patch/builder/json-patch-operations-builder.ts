import { Store } from '@ngrx/store';
import { CoreState } from '../../core.reducers';
import {
  NewPatchAddOperationAction, NewPatchRemoveOperationAction,
  NewPatchReplaceOperationAction
} from '../json-patch-operations.actions';
import { JsonPatchOperationPathObject } from './json-patch-operation-path-combiner';
import { Injectable } from '@angular/core';
import { isNotEmpty } from '../../../shared/empty.util';

@Injectable()
export class JsonPatchOperationsBuilder {

  constructor(private store: Store<CoreState>) {
  }

  add(path: JsonPatchOperationPathObject, value, plain = false) {
    this.store.dispatch(
      new NewPatchAddOperationAction(
        path.rootElement,
        path.subRootElement,
        path.path, this.prepareValue(value, plain)));
  }

  replace(path: JsonPatchOperationPathObject, value, plain = false) {
    this.store.dispatch(
      new NewPatchReplaceOperationAction(
        path.rootElement,
        path.subRootElement,
        path.path,
        this.prepareValue(value, plain)));
  }

  remove(path: JsonPatchOperationPathObject) {
    this.store.dispatch(
      new NewPatchRemoveOperationAction(
        path.rootElement,
        path.subRootElement,
        path.path));
  }

  protected prepareValue(value: any, plain) {
    let operationValue: any = null;
    if (isNotEmpty(value)) {
      if (plain) {
        operationValue = value
      } else {
        operationValue = [];
        if (Array.isArray(value)) {
          value.forEach((entry) => {
            if ((typeof entry === 'object')) {
              operationValue.push(entry);
            } else {
              operationValue.push({value: entry});
            }
          })
        } else if ((typeof value === 'object') && value.hasOwnProperty('value')) {
          operationValue.push(value);
        } else {
          operationValue.push({value: value});
        }
      }
    }
    return operationValue;
  }

}
