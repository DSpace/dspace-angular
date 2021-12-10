
/**
 * Search parameters for retrieving authorizations from the REST API
 */
export class ItemSearchParams {
  uuidList: string[];

  constructor(uuidList?: string[]) {
    this.uuidList = uuidList;
  }
}
