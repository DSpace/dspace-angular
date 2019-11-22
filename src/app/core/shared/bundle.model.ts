import { DSpaceObject } from './dspace-object.model';
import { Bitstream } from './bitstream.model';
import { Item } from './item.model';
import { RemoteData } from '../data/remote-data';
import { Observable } from 'rxjs';
import { ResourceType } from './resource-type';
import { PaginatedList } from '../data/paginated-list';

export class Bundle extends DSpaceObject {
  static type = new ResourceType('bundle');

  /**
   * The bundle's name
   */
  name: string;

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

  /**
   * List of Bitstreams that are part of this Bundle
   */
  bitstreams: Observable<RemoteData<PaginatedList<Bitstream>>>;

}
