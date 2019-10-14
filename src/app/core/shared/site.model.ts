import { DSpaceObject } from './dspace-object.model';
import { ResourceType } from './resource-type';

/**
 * Model class for the Site object
 */
export class Site extends DSpaceObject {
​
  static type = new ResourceType('site');
​
}
