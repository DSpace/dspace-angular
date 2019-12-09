import { inheritSerialization } from 'cerialize';
import { NormalizedDSpaceObject } from './normalized-dspace-object.model';
import { mapsTo } from '../builders/build-decorators';
import { Site } from '../../shared/site.model';

/**
 * Normalized model class for a Site object
 */
@mapsTo(Site)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedSite extends NormalizedDSpaceObject<Site> {

}
