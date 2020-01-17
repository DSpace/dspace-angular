import { autoserialize } from 'cerialize';
import { CacheableObject } from '../../cache/object-cache.reducer';
import { HALLink } from '../../shared/hal-link.model';

export abstract class IntegrationModel implements CacheableObject {

  @autoserialize
  self: string;

  @autoserialize
  uuid: string;

  @autoserialize
  public type: any;

  @autoserialize
  public _links: {
    self: HALLink,
    [name: string]: HALLink
  }

}
