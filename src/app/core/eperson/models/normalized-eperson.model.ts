import { autoserialize, inheritSerialization } from 'cerialize';
import { CacheableObject } from '../../cache/object-cache.reducer';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { NormalizedDSpaceObject } from '../../cache/models/normalized-dspace-object.model';
import { EPerson } from './eperson.model';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { ResourceType } from '../../shared/resource-type';

@mapsTo(EPerson)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedEPerson extends NormalizedDSpaceObject<EPerson> implements CacheableObject, ListableObject {

  @autoserialize
  public handle: string;

  @autoserialize
  @relationship(ResourceType.Group, true)
  groups: string[];

  @autoserialize
  public netid: string;

  @autoserialize
  public lastActive: string;

  @autoserialize
  public canLogIn: boolean;

  @autoserialize
  public email: string;

  @autoserialize
  public requireCertificate: boolean;

  @autoserialize
  public selfRegistered: boolean;
}
