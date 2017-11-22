import { DSpaceObject } from './dspace-object.model';

export class ResourcePolicies extends DSpaceObject {

  /**
   * The identifier of the access condition
   */
  id: any;

  /**
   * The group uuid bound to the access condition
   */
  groupUUID: string;

  /**
   * The end date of the access condition
   */
  endDate: string;
}
