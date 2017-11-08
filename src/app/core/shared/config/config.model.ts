import { autoserialize } from 'cerialize';

export abstract class ConfigObject {

  @autoserialize
  public name: string;

  @autoserialize
  public type: string;

  @autoserialize
  public _links: {
    [name: string]: string
  }

  /**
   * The link to the rest endpoint where this config object can be found
   */
  @autoserialize
  self: string;
}
