import { DSpaceObject } from './dspace-object.model';
import { RemoteData } from '../data/remote-data';
import { Item } from './item.model';
import { BitstreamFormat } from './bitstream-format.model';

export class Bitstream extends DSpaceObject {

  /**
   * The size of this bitstream in bytes
   */
  sizeBytes: number;

  /**
   * The description of this Bitstream
   */
  description: string;

  /**
   * The name of the Bundle this Bitstream is part of
   */
  bundleName: string;

  /**
   * An array of Bitstream Format of this Bitstream
   */
  format: RemoteData<BitstreamFormat>;

  /**
   * An array of Items that are direct parents of this Bitstream
   */
  parents: RemoteData<Item[]>;

  /**
   * The Bundle that owns this Bitstream
   */
  owner: RemoteData<Item>;

  /**
   * The URL to retrieve this Bitstream's file
   */
  content: string;

}
