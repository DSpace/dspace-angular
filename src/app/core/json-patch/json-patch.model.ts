export enum JsonPatchOperationType {
  test = 'test',
  remove = 'remove',
  add = 'add',
  replace = 'replace',
  move = 'move',
  copy = 'copy',
}

export class JsonPatchOperationModel {
  op: JsonPatchOperationType;
  path: string;
  value: any;
}
