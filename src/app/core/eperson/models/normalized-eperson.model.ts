import { autoserialize, deserialize, inheritSerialization } from 'cerialize';

import { CacheableObject } from '../../cache/object-cache.reducer';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { NormalizedDSpaceObject } from '../../cache/models/normalized-dspace-object.model';
import { EPerson } from './eperson.model';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { ResourceType } from '../../shared/resource-type';

@mapsTo(EPerson)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedEPerson extends NormalizedDSpaceObject<EPerson> implements CacheableObject, ListableObject {

  /**
   * A string representing the unique handle of this EPerson
   */
  @autoserialize
  public handle: string;

  /**
   * List of Groups that this EPerson belong to
   */
  @deserialize
  @relationship(ResourceType.Group, true)
  groups: string[];

  /**
   * A string representing the netid of this EPerson
   */
  @autoserialize
  public netid: string;

  /**
   * A string representing the last active date for this EPerson
   */
  @autoserialize
  public lastActive: string;

  /**
   * A boolean representing if this EPerson can log in
   */
  @autoserialize
  public canLogIn: boolean;

  /**
   * The EPerson email address
   */
  @autoserialize
  public email: string;

  /**
   * A boolean representing if this EPerson require certificate
   */
  @autoserialize
  public requireCertificate: boolean;

  /**
   * A boolean representing if this EPerson registered itself
   */
  @autoserialize
  public selfRegistered: boolean;
}
