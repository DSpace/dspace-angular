export class ItemOperation {

  operationKey: string;
  operationUrl: string;
  disabled: boolean;

  constructor(operationKey: string, operationUrl: string) {
    this.operationKey = operationKey;
    this.operationUrl = operationUrl;
    this.setDisabled(false);
  }

  /**
   * Set whether this operation should be disabled
   * @param disabled
   */
  setDisabled(disabled: boolean): void {
    this.disabled = disabled;
  }

}
