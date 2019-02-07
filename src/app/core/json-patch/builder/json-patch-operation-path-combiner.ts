import { isNotUndefined } from '../../../shared/empty.util';

/**
 * Interface used to represent a JSON-PATCH path member
 * in JsonPatchOperationsState
 */
export interface JsonPatchOperationPathObject {
  rootElement: string;
  subRootElement: string;
  path: string;
}

/**
 * Combines a variable number of strings representing parts
 * of a JSON-PATCH path
 */
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

  /**
   * Combines the parts of this JsonPatchOperationPathCombiner in to a JSON-PATCH path member
   *
   * e.g.   new JsonPatchOperationPathCombiner('sections', 'basic').getPath(['dc.title', '0'])
   * returns: sections/basic/dc.title/0
   *
   * @return {string}
   *      The combined path
   */
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
