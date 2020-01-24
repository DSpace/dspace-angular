import { map, startWith, filter, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { DSpaceObject } from './dspace-object.model';
import { Collection } from './collection.model';
import { RemoteData } from '../data/remote-data';
import { Bitstream } from './bitstream.model';
import { hasValueOperator, isNotEmpty, isEmpty } from '../../shared/empty.util';
import { PaginatedList } from '../data/paginated-list';
import { Relationship } from './item-relationships/relationship.model';
import { ResourceType } from './resource-type';
import { getAllSucceededRemoteData, getSucceededRemoteData } from './operators';
import { Bundle } from './bundle.model';
import { GenericConstructor } from './generic-constructor';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { DEFAULT_ENTITY_TYPE } from '../../shared/metadata-representation/metadata-representation.decorator';

/**
 * Class representing a DSpace Item
 */
export class Item extends DSpaceObject {
  static type = new ResourceType('item');

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

  /**
   * Bitstream bundles within this item
   */
  bundles: Observable<RemoteData<PaginatedList<Bundle>>>;

  relationships: Observable<RemoteData<PaginatedList<Relationship>>>;

  /**
   * Retrieves the thumbnail of this item
   * @returns {Observable<Bitstream>} the primaryBitstream of the 'THUMBNAIL' bundle
   */
  getThumbnail(): Observable<Bitstream> {
    // TODO: currently this just picks the first thumbnail
    // should be adjusted when we have a way to determine
    // the primary thumbnail from rest
    return this.getBitstreamsByBundleName('THUMBNAIL').pipe(
      filter((thumbnails) => isNotEmpty(thumbnails)),
      map((thumbnails) => thumbnails[0]),)
  }

  /**
   * Retrieves the thumbnail for the given original of this item
   * @returns {Observable<Bitstream>} the primaryBitstream of the 'THUMBNAIL' bundle
   */
  getThumbnailForOriginal(original: Bitstream): Observable<Bitstream> {
    return this.getBitstreamsByBundleName('THUMBNAIL').pipe(
      map((files) => {
        return files.find((thumbnail) => thumbnail.name.startsWith(original.name))
      }),startWith(undefined),);
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
   * TODO now that bitstreams can be paginated this should move to the server
   * see https://github.com/DSpace/dspace-angular/issues/332
   */
  getBitstreamsByBundleName(bundleName: string): Observable<Bitstream[]> {
    return this.bundles.pipe(
      getSucceededRemoteData(),
      map((rd: RemoteData<PaginatedList<Bundle>>) => rd.payload.page.find((bundle: Bundle) => bundle.name === bundleName)),
      hasValueOperator(),
      switchMap((bundle: Bundle) => bundle.bitstreams),
      getAllSucceededRemoteData(),
      map((rd: RemoteData<PaginatedList<Bitstream>>) => rd.payload.page),
      startWith([])
    );
  }

  /**
   * Method that returns as which type of object this object should be rendered
   */
  getRenderTypes(): Array<string | GenericConstructor<ListableObject>> {
    let entityType = this.firstMetadataValue('relationship.type');
    if (isEmpty(entityType)) {
      entityType = DEFAULT_ENTITY_TYPE;
    }
    return [entityType, ...super.getRenderTypes()];
  }
}
