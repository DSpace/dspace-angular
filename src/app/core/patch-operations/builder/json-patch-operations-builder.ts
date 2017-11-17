import { PatchOperationModel, PatchOperationType } from '../../shared/patch-request.model';
import { Store } from '@ngrx/store';
import { CoreState } from '../../core.reducers';
import { isNotEmpty } from '../../../shared/empty.util';
import {
  NewPatchAddOperationAction, NewPatchRemoveOperationAction,
  NewPatchReplaceOperationAction
} from '../json-patch-operations.actions';

export class JsonPatchOperationsBuilder {

  protected pathPrefixElements: {
    namespace: string;
    id: string;
  };

  constructor(private store: Store<CoreState>, namespace, id) {
    this.pathPrefixElements = {
      namespace: namespace,
      id: id
    };
  }

  protected makePath(key, id?) {
    let pathPrefix;
    if (isNotEmpty(id)) {
      pathPrefix = '/' + this.pathPrefixElements.namespace + '/' + id + '/';
    } else {
      pathPrefix = '/' + this.pathPrefixElements.namespace + '/' + this.pathPrefixElements.id + '/';
    }
    return pathPrefix + key;
  }

  add(key, value, id?) {
    this.store.dispatch(new NewPatchAddOperationAction(this.pathPrefixElements.namespace, this.makePath(key, id), value));
  }

  replace(key, value, id?) {
    this.store.dispatch(new NewPatchReplaceOperationAction(this.pathPrefixElements.namespace, this.makePath(key, id), value));
  }

  remove(key, id?) {
    this.store.dispatch(new NewPatchRemoveOperationAction(this.pathPrefixElements.namespace, this.makePath(key, id)));
  }

}
