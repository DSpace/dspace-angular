import { autoserialize, autoserializeAs } from 'cerialize';
import { PageInfo } from '../shared/page-info.model';
import { NormalizedBitstreamFormat } from '../cache/models/normalized-bitstream-format.model';

export class RegistryBitstreamformatsResponse {
  @autoserializeAs(NormalizedBitstreamFormat)
  bitstreamformats: NormalizedBitstreamFormat[];

  @autoserialize
  page: PageInfo;

  @autoserialize
  self: string;
}
