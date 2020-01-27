import { Observable } from 'rxjs';
import { link } from '../cache/builders/build-decorators';
import { RemoteData } from '../data/remote-data';
import { BitstreamFormat } from './bitstream-format.model';
import { BITSTREAM_FORMAT } from './bitstream-format.resource-type';
import { BITSTREAM } from './bitstream.resource-type';
import { DSpaceObject } from './dspace-object.model';
import { HALLink } from './hal-link.model';
import { HALResource } from './hal-resource.model';

export class Bitstream extends DSpaceObject implements HALResource {
  static type = BITSTREAM;

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
   * The Thumbnail for this Bitstream
   */
  thumbnail?: Observable<RemoteData<Bitstream>>;

  /**
   * The Bitstream Format for this Bitstream
   */
  @link(BITSTREAM_FORMAT)
  format?: Observable<RemoteData<BitstreamFormat>>;

  _links: {
    self: HALLink;
    bundle: HALLink;
    format: HALLink;
    content: HALLink;
  }
}
