import { MetadataMap, MetadataValue, MetadataValueFilter } from './metadata.interfaces';
import { Metadata } from './metadata.model';
import { CacheableObject } from '../cache/object-cache.reducer';
import { RemoteData } from '../data/remote-data';
import { ResourceType } from './resource-type';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { Observable } from 'rxjs';
import { autoserialize } from 'cerialize';

/**
 * An abstract model class for a DSpaceObject.
 */
export class DSpaceObject implements CacheableObject, ListableObject {

  self: string;

  /**
   * The human-readable identifier of this DSpaceObject
   */
  @autoserialize
  id: string;

  /**
   * The universally unique identifier of this DSpaceObject
   */
  @autoserialize
  uuid: string;

  /**
   * A string representing the kind of DSpaceObject, e.g. community, item, …
   */
  type: ResourceType;

  /**
   * The name for this DSpaceObject
   */
  get name(): string {
    return this.firstMetadataValue('dc.title');
  }

  /**
   * All metadata of this DSpaceObject
   */
  @autoserialize
  metadata: MetadataMap;

  /**
   * An array of DSpaceObjects that are direct parents of this DSpaceObject
   */
  parents: Observable<RemoteData<DSpaceObject[]>>;

  /**
   * The DSpaceObject that owns this DSpaceObject
   */
  owner: Observable<RemoteData<DSpaceObject>>;

  /** Gets all matching metadata in this DSpaceObject. See `Metadata.all` for more information. */
  allMetadata(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): MetadataValue[] {
    return Metadata.all(this.metadata, keyOrKeys, valueFilter);
  }

  /** Like `allMetadata`, but only returns string values. */
  allMetadataValues(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): string[] {
    return Metadata.allValues(this.metadata, keyOrKeys, valueFilter);
  }

  /** Gets the first matching metadata in this DSpaceObject, or `undefined`. */
  firstMetadata(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): MetadataValue {
    return Metadata.first(this.metadata, keyOrKeys, valueFilter);
  }

  /** Like `firstMetadata`, but only returns a string value, or `undefined`. */
  firstMetadataValue(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): string {
    return Metadata.firstValue(this.metadata, keyOrKeys, valueFilter);
  }

  /** Checks for matching metadata in this DSpaceObject. */
  hasMetadata(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): boolean {
    return Metadata.has(this.metadata, keyOrKeys, valueFilter);
  }

}
