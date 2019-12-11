import { Observable } from 'rxjs';
import { RemoteData } from '../data/remote-data';
import { BitstreamFormat } from './bitstream-format.model';
import { DSpaceObject } from './dspace-object.model';
import { HALLink } from './HALLink.model';
import { ResourceType } from './resource-type';

export class Bitstream extends DSpaceObject {
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
  format?: Observable<RemoteData<BitstreamFormat>>;

  /**
   * The URL to retrieve this Bitstream's file
   */
  content: string;

  _links: {
    self: HALLink;
    bundle: HALLink;
    content: HALLink;
    format: HALLink;
  }
}
