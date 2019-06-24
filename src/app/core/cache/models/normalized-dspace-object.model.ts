import { autoserializeAs, deserializeAs, autoserialize } from 'cerialize';
import { DSpaceObject } from '../../shared/dspace-object.model';
import { MetadataMap, MetadataMapSerializer } from '../../shared/metadata.models';
import { mapsTo } from '../builders/build-decorators';
import { NormalizedObject } from './normalized-object.model';
import { TypedObject } from '../object-cache.reducer';

/**
 * An model class for a DSpaceObject.
 */
@mapsTo(DSpaceObject)
export class NormalizedDSpaceObject<T extends DSpaceObject> extends NormalizedObject<T> implements TypedObject {

  /**
   * The link to the rest endpoint where this object can be found
   *
   * Repeated here to make the serialization work,
   * inheritSerialization doesn't seem to work for more than one level
   */
  @deserializeAs(String)
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
   */
  @autoserializeAs(String)
  uuid: string;

  /**
   * A string representing the kind of DSpaceObject, e.g. community, item, …
   */
  @autoserialize
  type: string;

  /**
   * All metadata of this DSpaceObject
   */
  @autoserializeAs(MetadataMapSerializer)
  metadata: MetadataMap;

  /**
   * An array of DSpaceObjects that are direct parents of this DSpaceObject
   */
  @deserializeAs(String)
  parents: string[];

  /**
   * The DSpaceObject that owns this DSpaceObject
   */
  @deserializeAs(String)
  owner: string;

  /**
   * The links to all related resources returned by the rest api.
   *
   * Repeated here to make the serialization work,
   * inheritSerialization doesn't seem to work for more than one level
   */
  @deserializeAs(Object)
  _links: {
    [name: string]: string
  }
}
