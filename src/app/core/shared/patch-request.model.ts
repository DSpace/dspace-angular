export enum PatchOperationType {
  test = 'test',
  remove = 'remove',
  add = 'add',
  replace = 'replace',
  move = 'move',
  copy = 'copy',
}

export class PatchOperationModel {
  op: PatchOperationType;
  path: string;
  value: any;
}
