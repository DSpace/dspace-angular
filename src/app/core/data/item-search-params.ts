
/**
 * Search parameters for retrieving items from the REST API
 */
export class ItemSearchParams {
  uuidList: string[];

  constructor(uuidList?: string[]) {
    this.uuidList = uuidList;
  }
}
