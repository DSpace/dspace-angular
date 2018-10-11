/**
 * Combines a variable number of strings representing parts
 * of a relative REST URL in to a single, absolute REST URL
 *
 */
import { isNotUndefined } from '../../../shared/empty.util';

export interface JsonPatchOperationPathObject {
  rootElement: string;
  subRootElement: string;
  path: string;
}

export class JsonPatchOperationPathCombiner  {
  private _rootElement: string;
  private _subRootElement: string;

  constructor(rootElement, ...subRootElements: string[]) {
    this._rootElement = rootElement;
    this._subRootElement = subRootElements.join('/');
  }

  get rootElement(): string {
    return this._rootElement;
  }

  get subRootElement(): string {
    return this._subRootElement;
  }

  public getPath(fragment?: string|string[]): JsonPatchOperationPathObject {
    if (isNotUndefined(fragment) && Array.isArray(fragment)) {
      fragment = fragment.join('/');
    }

    let path;
    if (isNotUndefined(fragment)) {
      path = '/' + this._rootElement + '/' + this._subRootElement + '/' + fragment;
    } else {
      path = '/' + this._rootElement + '/' + this._subRootElement;
    }

    return {rootElement: this._rootElement, subRootElement: this._subRootElement, path: path};
  }
}
