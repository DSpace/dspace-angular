import { autoserialize } from 'cerialize';
import { CacheableObject } from '../../cache/object-cache.reducer';

export abstract class IntegrationModel implements CacheableObject {

  @autoserialize
  self: string;

  @autoserialize
  uuid: string;

  @autoserialize
  public type: any;

  @autoserialize
  public _links: {
    [name: string]: string
  }

}
