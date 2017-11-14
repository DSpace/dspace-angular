
export class RestPatchBuilder {

  protected patchBody = [];

  add(path, value) {
    this.makePatchEntry('add', path, value);
  }

  replace(path, value) {
    this.makePatchEntry('replace', path, value);
  }

  remove(path, value) {
    this.makePatchEntry('remove', path, value);
  }

  protected makePatchEntry(operation, path, value) {
    this.patchBody.push({ op: operation, path: path, value: value });
  }

  getPatchBody() {
    return this.patchBody;
  }
}
