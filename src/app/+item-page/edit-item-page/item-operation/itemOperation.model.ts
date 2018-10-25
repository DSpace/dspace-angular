export class ItemOperation {

  operationKey: string;
  operationUrl: string;
  disabled: boolean;

  constructor(operationKey: string, operationUrl: string) {
    this.operationKey = operationKey;
    this.operationUrl = operationUrl;
  }

}
