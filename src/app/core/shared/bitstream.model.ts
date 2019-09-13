import { DSpaceObject } from './dspace-object.model';
import { RemoteData } from '../data/remote-data';
import { Item } from './item.model';
import { BitstreamFormat } from './bitstream-format.model';
import { Observable } from 'rxjs';
import { ResourceType } from './resource-type';
import { hasValue, isUndefined } from '../../shared/empty.util';

export class Bitstream extends DSpaceObject {
  static type = new ResourceType('bitstream');

  private _description: string;

  /**
   * The size of this bitstream in bytes
   */
  sizeBytes: number;

  /**
   * Get the description of this Bitstream
   */
  get description(): string {
    return (isUndefined(this._description)) ? this.firstMetadataValue('dc.description') : this._description;
  }

  /**
   * Set the description of this Bitstream
   */
  set description(description) {
    if (hasValue(this.firstMetadata('dc.description'))) {
      this.firstMetadata('dc.description').value = description;
    }
    this._description = description;
  }

  /**
   * The name of the Bundle this Bitstream is part of
   */
  bundleName: string;

  /**
   * An array of Bitstream Format of this Bitstream
   */
  format: Observable<RemoteData<BitstreamFormat>>;

  /**
   * An array of Items that are direct parents of this Bitstream
   */
  parents: Observable<RemoteData<Item[]>>;

  /**
   * The Bundle that owns this Bitstream
   */
  owner: Observable<RemoteData<Item>>;

  /**
   * The URL to retrieve this Bitstream's file
   */
  content: string;
}
