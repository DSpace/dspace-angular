import { autoserialize } from 'cerialize';

export abstract class EpersonModel {

  @autoserialize
  public id: string;

  @autoserialize
  public uuid: string;

  @autoserialize
  public name: string;

  @autoserialize
  public handle: string;

  @autoserialize
  public metadata: any;

  @autoserialize
  public groups: any;

  @autoserialize
  public type: string;

  @autoserialize
  public _links: {
    [name: string]: string
  }
}
