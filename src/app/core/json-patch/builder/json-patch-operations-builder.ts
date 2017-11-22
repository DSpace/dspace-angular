import { Store } from '@ngrx/store';
import { CoreState } from '../../core.reducers';
import { isNotEmpty } from '../../../shared/empty.util';
import {
  NewPatchAddOperationAction, NewPatchRemoveOperationAction,
  NewPatchReplaceOperationAction
} from '../json-patch-operations.actions';

export class JsonPatchOperationsBuilder {

  protected pathPrefixElements: {
    resourceType: string;
    resourceId: string;
  };

  constructor(private store: Store<CoreState>, resourceType, resourceId) {
    this.pathPrefixElements = {
      resourceType: resourceType,
      resourceId: resourceId
    };
  }

  protected makePath(key, id?) {
    let pathPrefix;
    if (isNotEmpty(id)) {
      pathPrefix = '/' + this.pathPrefixElements.resourceType + '/' + id + '/';
    } else {
      pathPrefix = '/' + this.pathPrefixElements.resourceType + '/' + this.pathPrefixElements.resourceId + '/';
    }
    return pathPrefix + key;
  }

  add(key, value, id?) {
    this.store.dispatch(
      new NewPatchAddOperationAction(
        this.pathPrefixElements.resourceType,
        this.pathPrefixElements.resourceId,
        this.makePath(key, id), this.prepareValue(value)));
  }

  replace(key, value, id?) {
    this.store.dispatch(
      new NewPatchReplaceOperationAction(
        this.pathPrefixElements.resourceType,
        this.pathPrefixElements.resourceId,
        this.makePath(key, id),
        this.prepareValue(value)));
  }

  remove(key, id?) {
    this.store.dispatch(
      new NewPatchRemoveOperationAction(
        this.pathPrefixElements.resourceType,
        this.pathPrefixElements.resourceId,
        this.makePath(key, id)));
  }

  protected prepareValue(value: any) {
    const operationValue = []
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        operationValue.push({value: entry})
      })
    } else if ((typeof value === 'object') && value.hasOwnProperty('value')) {
      operationValue.push(value);
    } else {
      operationValue.push({value: value});
    }
    return operationValue;
  }

}
