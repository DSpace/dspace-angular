import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';

import { Metadatum } from '../../shared/metadatum.model';
import { ResourceType } from '../../shared/resource-type';
import { NormalizedObject } from './normalized-object.model';

/**
 * An abstract model class for a DSpaceObject.
 */
export abstract class NormalizedDSpaceObject extends NormalizedObject {

  /**
   * The link to the rest endpoint where this object can be found
   *
   * Repeated here to make the serialization work,
   * inheritSerialization doesn't seem to work for more than one level
   */
  @autoserialize
  self: string;

  /**
   * The human-readable identifier of this DSpaceObject
   *
   * Currently mapped to uuid but left in to leave room
   * for a shorter, more user friendly type of id
   */
  @autoserializeAs(String, 'uuid')
  id: string;

  /**
   * The universally unique identifier of this DSpaceObject
   *
   * Repeated here to make the serialization work,
   * inheritSerialization doesn't seem to work for more than one level
   */
  @autoserialize
  uuid: string;

  /**
   * A string representing the kind of DSpaceObject, e.g. community, item, …
   */
  @autoserialize
  type: ResourceType;

  /**
   * The name for this DSpaceObject
   */
  @autoserialize
  name: string;

  /**
   * An array containing all metadata of this DSpaceObject
   */
  @autoserializeAs(Metadatum)
  metadata: Metadatum[];

  /**
   * An array of DSpaceObjects that are direct parents of this DSpaceObject
   */
  @autoserialize
  parents: string[];

  /**
   * The DSpaceObject that owns this DSpaceObject
   */
  @autoserialize
  owner: string;

}
