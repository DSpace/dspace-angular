import { autoserialize, inheritSerialization } from 'cerialize';
import { mapsTo } from '../builders/build-decorators';
import { NormalizedDSpaceObject } from './normalized-dspace-object.model';
import { License } from '../../shared/license.model';

@mapsTo(License)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedLicense extends NormalizedDSpaceObject {

  /**
   * Is the license custom?
   */
  @autoserialize
  custom: boolean;

  /**
   * The text of the license
   */
  @autoserialize
  text: string;
}
