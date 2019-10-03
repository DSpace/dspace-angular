import { DSpaceObject } from './dspace-object.model';
import { ResourceType } from './resource-type';

export class License extends DSpaceObject {
  static type = new ResourceType('license');

  /**
   * Is the license custom?
   */
  custom: boolean;

  /**
   * The text of the license
   */
  text: string;
}
