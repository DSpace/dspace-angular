import { Observable } from 'rxjs';
import { link } from '../cache/builders/build-decorators';
import { RemoteData } from '../data/remote-data';
import { BitstreamFormat } from './bitstream-format.model';
import { Bundle } from './bundle.model';
import { DSpaceObject } from './dspace-object.model';
import { HALResource } from './hal-resource.model';
import { HALLink } from './hal-link.model';
import { ResourceType } from './resource-type';

export class Bitstream extends DSpaceObject implements HALResource {
  static type = new ResourceType('bitstream');

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
  @link(BitstreamFormat.type)
  format?: Observable<RemoteData<BitstreamFormat>>;

  _links: {
    // @link(Bitstream.type)
    self: HALLink;

    // @link(Bundle.type)
    bundle: HALLink;

    // @link(BitstreamFormat.type)
    format: HALLink;

    content: HALLink;
  }
}
