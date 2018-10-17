import { autoserialize } from 'cerialize';
import { NormalizedObject } from '../../cache/models/normalized-object.model';

export abstract class ConfigObject extends  NormalizedObject {

  @autoserialize
  public name: string;

  @autoserialize
  public type: any;

  @autoserialize
  public _links: {
    [name: string]: string
  };

  /**
   * The link to the rest endpoint where this config object can be found
   */
  @autoserialize
  self: string;
}
