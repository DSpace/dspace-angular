/**
 * Class representing a query parameter (query?fieldName=fieldValue) used in FindListOptions object
 */
export class RequestParam {
  constructor(
    public fieldName: string,
    public fieldValue: any,
    public encodeValue = true,
  ) {
    if (encodeValue) {
      this.fieldValue = encodeURIComponent(fieldValue);
    }
  }
}
