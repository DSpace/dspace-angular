import { PatchOperationModel, PatchOperationType } from './patch-request.model';

export class RequestPatchBodyBuilder {

  private _body: PatchOperationModel[] = [];

  add(path, value) {
    this.makePatchEntry(PatchOperationType.add, path, value);
  }

  replace(path, value) {
    this.makePatchEntry(PatchOperationType.replace, path, value);
  }

  remove(path, value) {
    this.makePatchEntry(PatchOperationType.remove, path, value);
  }

  protected makePatchEntry(operation, path, value) {
    this.body.push({ op: operation, path: path, value: value });
  }

  get body(): PatchOperationModel[] {
    return this._body;
  }
}
