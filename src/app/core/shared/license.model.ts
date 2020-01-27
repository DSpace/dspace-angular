import { DSpaceObject } from './dspace-object.model';
import { LICENSE } from './license.resource-type';

export class License extends DSpaceObject {
  static type = LICENSE;

  /**
   * Is the license custom?
   */
  custom: boolean;

  /**
   * The text of the license
   */
  text: string;
}
