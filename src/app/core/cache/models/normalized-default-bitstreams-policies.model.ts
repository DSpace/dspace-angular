import { autoserialize, inheritSerialization } from 'cerialize';
import { mapsTo } from '../builders/build-decorators';
import { NormalizedDSpaceObject } from './normalized-dspace-object.model';
import { DefaultBitstreamsPolicies } from '../../shared/default-bitstreams-policies.model';

@mapsTo(DefaultBitstreamsPolicies)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedDefaultBitstreamsPolicies extends NormalizedDSpaceObject {

  /**
   * The identifier of the access condition
   *
   */
  @autoserialize
  id: any;

  /**
   * The group uuid bound to the access condition
   */
  @autoserialize
  groupUuid: string;

  /**
   * The end date of the access condition
   */
  @autoserialize
  endDate: string;
}
