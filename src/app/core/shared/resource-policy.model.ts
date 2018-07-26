import { DSpaceObject } from './dspace-object.model';

export class ResourcePolicy extends DSpaceObject {

  /**
   * The action of the resource policy
   */
  action: string;

  /**
   * The identifier of the resource policy
   */
  id: string;

  /**
   * The group uuid bound to the resource policy
   */
  groupUUID: string;

  /**
   * The end date of the resource policy
   */
  endDate: string;

  /**
   * The start date of the resource policy
   */
  startDate: string;

  /**
   * The type of the resource policy
   */
  rpType: string
}
