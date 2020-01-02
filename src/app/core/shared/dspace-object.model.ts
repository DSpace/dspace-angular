import { Observable } from 'rxjs';

import {
  MetadataMap,
  MetadataValue,
  MetadataValueFilter,
  MetadatumViewModel
} from './metadata.models';
import { Metadata } from './metadata.utils';
import { hasNoValue, isUndefined } from '../../shared/empty.util';
import { CacheableObject } from '../cache/object-cache.reducer';
import { RemoteData } from '../data/remote-data';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { excludeFromEquals } from '../utilities/equals.decorators';
import { ResourceType } from './resource-type';
import { GenericConstructor } from './generic-constructor';

/**
 * An abstract model class for a DSpaceObject.
 */
export class DSpaceObject extends ListableObject implements CacheableObject {
  /**
   * A string representing the kind of DSpaceObject, e.g. community, item, …
   */
  static type = new ResourceType('dspaceobject');

  @excludeFromEquals
  private _name: string;

  @excludeFromEquals
  self: string;

  /**
   * The human-readable identifier of this DSpaceObject
   */
  @excludeFromEquals
  id: string;

  /**
   * The universally unique identifier of this DSpaceObject
   */
  uuid: string;

  /**
   * A string representing the kind of DSpaceObject, e.g. community, item, …
   */
  @excludeFromEquals
  type: ResourceType;

  /**
   * The name for this DSpaceObject
   */
  get name(): string {
    return (isUndefined(this._name)) ? this.firstMetadataValue('dc.title') : this._name;
  }

  /**
   * The name for this DSpaceObject
   */
  set name(name) {
    this._name = name;
  }

  /**
   * All metadata of this DSpaceObject
   */
  @excludeFromEquals
  metadata: MetadataMap;

  /**
   * Retrieve the current metadata as a list of MetadatumViewModels
   */
  get metadataAsList(): MetadatumViewModel[] {
    return Metadata.toViewModelList(this.metadata);
  }

  /**
   * An array of DSpaceObjects that are direct parents of this DSpaceObject
   */
  @excludeFromEquals
  parents: Observable<RemoteData<DSpaceObject[]>>;

  /**
   * The DSpaceObject that owns this DSpaceObject
   */
  @excludeFromEquals
  owner: Observable<RemoteData<DSpaceObject>>;

  /**
   * Gets all matching metadata in this DSpaceObject.
   *
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
   * @param {MetadataValueFilter} filter The value filter to use. If unspecified, no filtering will be done.
   * @returns {MetadataValue[]} the matching values or an empty array.
   */
  allMetadata(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): MetadataValue[] {
    return Metadata.all(this.metadata, keyOrKeys, valueFilter);
  }

  /**
   * Like [[allMetadata]], but only returns string values.
   *
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
   * @param {MetadataValueFilter} filter The value filter to use. If unspecified, no filtering will be done.
   * @returns {string[]} the matching string values or an empty array.
   */
  allMetadataValues(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): string[] {
    return Metadata.allValues(this.metadata, keyOrKeys, valueFilter);
  }

  /**
   * Gets the first matching MetadataValue object in this DSpaceObject, or `undefined`.
   *
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
   * @param {MetadataValueFilter} filter The value filter to use. If unspecified, no filtering will be done.
   * @returns {MetadataValue} the first matching value, or `undefined`.
   */
  firstMetadata(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): MetadataValue {
    return Metadata.first(this.metadata, keyOrKeys, valueFilter);
  }

  /**
   * Like [[firstMetadata]], but only returns a string value, or `undefined`.
   *
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
   * @param {MetadataValueFilter} valueFilter The value filter to use. If unspecified, no filtering will be done.
   * @returns {string} the first matching string value, or `undefined`.
   */
  firstMetadataValue(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): string {
    return Metadata.firstValue(this.metadata, keyOrKeys, valueFilter);
  }

  /**
   * Checks for a matching metadata value in this DSpaceObject.
   *
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
   * @param {MetadataValueFilter} filter The value filter to use. If unspecified, no filtering will be done.
   * @returns {boolean} whether a match is found.
   */
  hasMetadata(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): boolean {
    return Metadata.has(this.metadata, keyOrKeys, valueFilter);
  }

  /**
   * Find metadata on a specific field and order all of them using their "place" property.
   * @param key
   */
  findMetadataSortedByPlace(key: string): MetadataValue[] {
    return this.allMetadata([key]).sort((a: MetadataValue, b: MetadataValue) => {
      if (hasNoValue(a.place) && hasNoValue(b.place)) {
        return 0;
      }
      if (hasNoValue(a.place)) {
        return -1;
      }
      if (hasNoValue(b.place)) {
        return 1;
      }
      return a.place - b.place;
    });
  }

  /**
   * Method that returns as which type of object this object should be rendered
   */
  getRenderTypes(): Array<string | GenericConstructor<ListableObject>> {
    return [this.constructor as GenericConstructor<ListableObject>];
  }
}
