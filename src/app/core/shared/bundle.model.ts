import { DSpaceObject } from './dspace-object.model';
import { Bitstream } from './bitstream.model';
import { Item } from './item.model';
import { RemoteData } from '../data/remote-data';
import { Observable } from 'rxjs';
import { ResourceType } from './resource-type';

export class Bundle extends DSpaceObject {
  static type = new ResourceType('bundle');

  /**
   * The primary bitstream of this Bundle
   */
  primaryBitstream: Observable<RemoteData<Bitstream>>;

  /**
   * An array of Items that are direct parents of this Bundle
   */
  parents: Observable<RemoteData<Item[]>>;

  /**
   * The Item that owns this Bundle
   */
  owner: Observable<RemoteData<Item>>;

  bitstreams: Observable<RemoteData<Bitstream[]>>

}
