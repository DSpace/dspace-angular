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
    this.store.dispatch(new NewPatchAddOperationAction(this.pathPrefixElements.resourceType, this.pathPrefixElements.resourceId, this.makePath(key, id), value));
  }

  replace(key, value, id?) {
    this.store.dispatch(new NewPatchReplaceOperationAction(this.pathPrefixElements.resourceType, this.pathPrefixElements.resourceId, this.makePath(key, id), value));
  }

  remove(key, id?) {
    this.store.dispatch(new NewPatchRemoveOperationAction(this.pathPrefixElements.resourceType, this.pathPrefixElements.resourceId, this.makePath(key, id)));
  }

}
