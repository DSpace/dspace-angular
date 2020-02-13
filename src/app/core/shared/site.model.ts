import { inheritSerialization } from 'cerialize';
import { resourceType } from '../cache/builders/build-decorators';
import { DSpaceObject } from './dspace-object.model';
import { SITE } from './site.resource-type';

/**
 * Model class for the Site object
 */
@resourceType(Site.type)
@inheritSerialization(DSpaceObject)
export class Site extends DSpaceObject {
​
  static type = SITE;
​
}
