import { autoserialize, inheritSerialization } from 'cerialize';
import { mapsTo } from '../builders/build-decorators';
import { NormalizedDSpaceObject } from './normalized-dspace-object.model';
import { License } from '../../shared/license.model';
import { resourceType } from '../../shared/resource-type.decorator';
import { ResourceType } from '../../shared/resource-type';

/**
 * Normalized model class for a Collection License
 */
@mapsTo(License)
@inheritSerialization(NormalizedDSpaceObject)
@resourceType(ResourceType.License)
export class NormalizedLicense extends NormalizedDSpaceObject<License> {

  /**
   * A boolean representing if this License is custom or not
   */
  @autoserialize
  custom: boolean;

  /**
   * The text of the license
   */
  @autoserialize
  text: string;
}
