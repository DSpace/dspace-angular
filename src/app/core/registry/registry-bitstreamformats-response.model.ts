import { autoserialize, autoserializeAs } from 'cerialize';
import { PageInfo } from '../shared/page-info.model';
import { BitstreamFormat } from '../shared/bitstream-format.model';

export class RegistryBitstreamformatsResponse {
  @autoserializeAs(BitstreamFormat)
  bitstreamformats: BitstreamFormat[];

  @autoserialize
  page: PageInfo;

  @autoserialize
  self: string;
}
