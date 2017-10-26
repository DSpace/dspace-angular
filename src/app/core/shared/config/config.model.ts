import { autoserialize, autoserializeAs } from 'cerialize';

export abstract class ConfigObject {

  @autoserialize
  public name: string;

  @autoserialize
  public type: string;

  @autoserialize
  public _links: {
    [name: string]: string
  }
}
