import { autoserialize, autoserializeAs } from 'cerialize';

import { BitstreamFormat } from '../shared/bitstream-format.model';
import { PageInfo } from '../shared/page-info.model';

export class RegistryBitstreamformatsResponse {
  @autoserializeAs(BitstreamFormat)
  bitstreamformats: BitstreamFormat[];

  @autoserialize
  page: PageInfo;

  @autoserialize
  self: string;
}
