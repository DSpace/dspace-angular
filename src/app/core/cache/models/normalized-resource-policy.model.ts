import { mapsTo } from '../builders/build-decorators';
import { autoserialize, inheritSerialization } from 'cerialize';
import { NormalizedDSpaceObject } from './normalized-dspace-object.model';
import { ResourcePolicy } from '../../shared/resource-policy.model';

@mapsTo(ResourcePolicy)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedResourcePolicy extends NormalizedDSpaceObject {

  /**
   * The action of the resource policy
   */
  @autoserialize
  action: string;

  /**
   * The identifier of the resource policy
   */
  @autoserialize
  id: string;

  /**
   * The group uuid bound to the resource policy
   */
  @autoserialize
  groupUUID: string;

  /**
   * The end date of the resource policy
   */
  @autoserialize
  endDate: string;

  /**
   * The start date of the resource policy
   */
  @autoserialize
  startDate: string;

  /**
   * The type of the resource policy
   */
  @autoserialize
  rpType: string
}
