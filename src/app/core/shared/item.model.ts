import { Observable } from 'rxjs/Observable';

import { DSpaceObject } from './dspace-object.model';
import { Collection } from './collection.model';
import { RemoteData } from '../data/remote-data';
import { Bitstream } from './bitstream.model';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { PaginatedList } from '../data/paginated-list';

export class Item extends DSpaceObject {

  /**
   * A string representing the unique handle of this Item
   */
  handle: string;

  /**
   * The Date of the last modification of this Item
   */
  lastModified: Date;

  /**
   * A boolean representing if this Item is currently archived or not
   */
  isArchived: boolean;

  /**
   * A boolean representing if this Item is currently discoverable or not
   */
  isDiscoverable: boolean;

  /**
   * A boolean representing if this Item is currently withdrawn or not
   */
  isWithdrawn: boolean;

  /**
   * An array of Collections that are direct parents of this Item
   */
  parents: Observable<RemoteData<Collection[]>>;

  /**
   * The Collection that owns this Item
   */
  owningCollection: Observable<RemoteData<Collection>>;

  get owner(): Observable<RemoteData<Collection>> {
    return this.owningCollection;
  }

  bitstreams: Observable<RemoteData<PaginatedList<Bitstream>>>;

  /**
   * Retrieves the thumbnail of this item
   * @returns {Observable<Bitstream>} the primaryBitstream of the 'THUMBNAIL' bundle
   */
  getThumbnail(): Observable<Bitstream> {
    // TODO: currently this just picks the first thumbnail
    // should be adjusted when we have a way to determine
    // the primary thumbnail from rest
    return this.getBitstreamsByBundleName('THUMBNAIL')
      .filter((thumbnails) => isNotEmpty(thumbnails))
      .map((thumbnails) => thumbnails[0])
  }

  /**
   * Retrieves the thumbnail for the given original of this item
   * @returns {Observable<Bitstream>} the primaryBitstream of the 'THUMBNAIL' bundle
   */
  getThumbnailForOriginal(original: Bitstream): Observable<Bitstream> {
    return this.getBitstreamsByBundleName('THUMBNAIL')
      .map((files) => {
        return files.find((thumbnail) => thumbnail.name.startsWith(original.name))
      }).startWith(undefined);
  }

  /**
   * Retrieves all files that should be displayed on the item page of this item
   * @returns {Observable<Array<Observable<Bitstream>>>} an array of all Bitstreams in the 'ORIGINAL' bundle
   */
  getFiles(): Observable<Bitstream[]> {
    return this.getBitstreamsByBundleName('ORIGINAL');
  }

  /**
   * Retrieves bitstreams by bundle name
   * @param bundleName The name of the Bundle that should be returned
   * @returns {Observable<Bitstream[]>} the bitstreams with the given bundleName
   */
  getBitstreamsByBundleName(bundleName: string): Observable<Bitstream[]> {
    return this.bitstreams
      .map((rd: RemoteData<PaginatedList<Bitstream>>) => rd.payload.page)
      .filter((bitstreams: Bitstream[]) => hasValue(bitstreams))
      .startWith([])
      .map((bitstreams) => {
        return bitstreams
          .filter((bitstream) => hasValue(bitstream))
          .filter((bitstream) => bitstream.bundleName === bundleName)
      });
  }

}
