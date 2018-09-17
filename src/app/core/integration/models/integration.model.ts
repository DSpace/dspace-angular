import { autoserialize } from 'cerialize';

export abstract class IntegrationModel {

  @autoserialize
  public type: string;

  @autoserialize
  public _links: {
    [name: string]: string
  }
}
