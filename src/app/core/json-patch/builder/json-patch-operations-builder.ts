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

  add(path: JsonPatchOperationPathObject, value, plain = false, first = false) {
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
        operationValue = value
      } else {
        if (Array.isArray(value)) {
          operationValue = [];
          value.forEach((entry) => {
            if ((typeof entry === 'object')) {
              operationValue.push(entry);
            } else {
              operationValue.push({value: entry});
            }
          })
        } else if ((typeof value === 'object') && value.hasOwnProperty('value')) {
          operationValue = value;
        } else {
          operationValue = {value: value};
        }
      }
    }
    return (first && !Array.isArray(operationValue)) ? [operationValue] : operationValue;
  }

}
