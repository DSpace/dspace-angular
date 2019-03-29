import { DSpaceObject } from './dspace-object.model';

export class License extends DSpaceObject {

  /**
   * Is the license custom?
   */
  custom: boolean;

  /**
   * The text of the license
   */
  text: string;
}
