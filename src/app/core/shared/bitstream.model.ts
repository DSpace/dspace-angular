import { autoserialize, deserialize, inheritSerialization } from 'cerialize';
import { Observable } from 'rxjs';
import { link, typedObject } from '../cache/builders/build-decorators';
import { RemoteData } from '../data/remote-data';
import { BitstreamFormat } from './bitstream-format.model';
import { BITSTREAM_FORMAT } from './bitstream-format.resource-type';
import { BITSTREAM } from './bitstream.resource-type';
import { DSpaceObject } from './dspace-object.model';
import { HALLink } from './hal-link.model';
import { HALResource } from './hal-resource.model';

@typedObject
@inheritSerialization(DSpaceObject)
export class Bitstream extends DSpaceObject implements HALResource {
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
   * The {@link HALLink}s for this Bitstream
   */
  @deserialize
  _links: {
    self: HALLink;
    bundle: HALLink;
    format: HALLink;
    content: HALLink;
  };

  /**
   * The thumbnail for this Bitstream
   * Needs to be resolved first, but isn't available as a {@link HALLink} yet
   * Use BitstreamDataService.getThumbnailFor(…) for now.
   */
  thumbnail?: Observable<RemoteData<Bitstream>>;

  /**
   * The BitstreamFormat of this Bitstream
   * Will be undefined unless the format {@link HALLink} has been resolved.
   */
  @link(BITSTREAM_FORMAT, false, 'format')
  format?: Observable<RemoteData<BitstreamFormat>>;

}
