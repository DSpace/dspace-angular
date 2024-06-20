import { autoserialize, deserialize, inheritSerialization } from 'cerialize';
import { Observable } from 'rxjs';
import { link, typedObject } from '../cache/builders/build-decorators';
import { RemoteData } from '../data/remote-data';
import { BitstreamFormat } from './bitstream-format.model';
import { BITSTREAM_FORMAT } from './bitstream-format.resource-type';
import { BITSTREAM } from './bitstream.resource-type';
import { DSpaceObject } from './dspace-object.model';
import { HALLink } from './hal-link.model';
import {BUNDLE} from './bundle.resource-type';
import {Bundle} from './bundle.model';
import { ChildHALResource } from './child-hal-resource.model';
import { BITSTREAM_CHECKSUM } from './bitstream-checksum.resource';
import { BitstreamChecksum } from './bitstream-checksum.model';

// Store number if the bitstream is stored in the both stores (S3 and local)
export const SYNCHRONIZED_STORES_NUMBER = 77;

@typedObject
@inheritSerialization(DSpaceObject)
export class Bitstream extends DSpaceObject implements ChildHALResource {
  static type = BITSTREAM;

  /**
   * The size of this bitstream in bytes
   */
  @autoserialize
  sizeBytes: number;

  /**
   * The description of this Bitstream
   */
  @autoserialize
  description: string;

  /**
   * The name of the Bundle this Bitstream is part of
   */
  @autoserialize
  bundleName: string;

  /**
   * The number of the store where the bitstream is store, it could be S3, local or both.
   */
  @autoserialize
  storeNumber: number;

  /**
   * The {@link HALLink}s for this Bitstream
   */
  @deserialize
  _links: {
    self: HALLink;
    bundle: HALLink;
    format: HALLink;
    content: HALLink;
    thumbnail: HALLink;
    checksum: HALLink;
  };

  /**
   * The thumbnail for this Bitstream
   * Will be undefined unless the thumbnail {@link HALLink} has been resolved.
   */
  @link(BITSTREAM, false, 'thumbnail')
  thumbnail?: Observable<RemoteData<Bitstream>>;

  /**
   * The BitstreamFormat of this Bitstream
   * Will be undefined unless the format {@link HALLink} has been resolved.
   */
  @link(BITSTREAM_FORMAT, false, 'format')
  format?: Observable<RemoteData<BitstreamFormat>>;

  /**
   * The owning bundle for this Bitstream
   * Will be undefined unless the bundle{@link HALLink} has been resolved.
   */
  @link(BUNDLE)
  bundle?: Observable<RemoteData<Bundle>>;

  /**
   * The checksum values fetched from the DB, local and S3 store.
   */
  @link(BITSTREAM_CHECKSUM)
  checksum?: Observable<RemoteData<BitstreamChecksum>>;

  getParentLinkKey(): keyof this['_links'] {
    return 'format';
  }
}
