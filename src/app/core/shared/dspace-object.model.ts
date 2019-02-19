import { Metadatum } from './metadatum.model'
import { isEmpty, isNotEmpty, isUndefined } from '../../shared/empty.util';
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

  private _name: string;

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
    return (isUndefined(this._name)) ? this.findMetadata('dc.title') : this._name;
  }

  /**
   * The name for this DSpaceObject
   */
  set name(name) {
    this._name = name;
  }

  /**
   * An array containing all metadata of this DSpaceObject
   */
  @autoserialize
  metadata: Metadatum[] = [];

  /**
   * An array of DSpaceObjects that are direct parents of this DSpaceObject
   */
  parents: Observable<RemoteData<DSpaceObject[]>>;

  /**
   * The DSpaceObject that owns this DSpaceObject
   */
  owner: Observable<RemoteData<DSpaceObject>>;

  /**
   * Find a metadata field by key and language
   *
   * This method returns the value of the first element
   * in the metadata array that matches the provided
   * key and language
   *
   * @param key
   * @param language
   * @return string
   */
  findMetadata(key: string, language?: string): string {
    const metadatum = (this.metadata) ? this.metadata.find((m: Metadatum) => {
      return m.key === key && (isEmpty(language) || m.language === language)
    }) : null;
    if (isNotEmpty(metadatum)) {
      return metadatum.value;
    } else {
      return undefined;
    }
  }

  /**
   * Find metadata by an array of keys
   *
   * This method returns the values of the element
   * in the metadata array that match the provided
   * key(s)
   *
   * @param key(s)
   * @return Array<Metadatum>
   */
  filterMetadata(keys: string[]): Metadatum[] {
    return (this.metadata || []).filter((metadatum: Metadatum) => {
      return keys.some((key) => key === metadatum.key);
    });
  }

}
