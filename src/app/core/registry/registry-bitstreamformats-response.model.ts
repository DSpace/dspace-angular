import { autoserialize, deserialize } from 'cerialize';
import { BITSTREAM_FORMAT } from '../shared/bitstream-format.resource-type';
import { HALLink } from '../shared/hal-link.model';
import { PageInfo } from '../shared/page-info.model';
import { BitstreamFormat } from '../shared/bitstream-format.model';
import { link } from '../cache/builders/build-decorators';

export class RegistryBitstreamformatsResponse {
  @autoserialize
  page: PageInfo;

  /**
   * The {@link HALLink}s for this RegistryBitstreamformatsResponse
   */
  @deserialize
  _links: {
    self: HALLink;
    bitstreamformats: HALLink;
  };

  @link(BITSTREAM_FORMAT)
  bitstreamformats?: BitstreamFormat[];

}
