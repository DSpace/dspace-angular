import { autoserialize, deserialize } from 'cerialize';
import { PageInfo } from '../shared/page-info.model';
import { BitstreamFormat } from '../shared/bitstream-format.model';
import { relationship } from '../cache/builders/build-decorators';

export class RegistryBitstreamformatsResponse {
  @deserialize
  @relationship(BitstreamFormat, true)
  bitstreamformats: BitstreamFormat[];

  @autoserialize
  page: PageInfo;

  @autoserialize
  self: string;
}
