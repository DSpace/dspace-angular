import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { BitstreamFormat } from '../../shared/bitstream-format.model';

import { mapsTo } from '../builders/build-decorators';
import { IDToUUIDSerializer } from '../it-to-uuid-serializer';
import { NormalizedObject } from './normalized-object.model';

@mapsTo(BitstreamFormat)
@inheritSerialization(NormalizedObject)
export class NormalizedBitstreamFormat extends NormalizedObject {

  @autoserialize
  shortDescription: string;

  @autoserialize
  description: string;

  @autoserialize
  mimetype: string;

  @autoserialize
  supportLevel: number;

  @autoserialize
  internal: boolean;

  @autoserialize
  extensions: string;

  @autoserialize
  id: string;

  @autoserializeAs(new IDToUUIDSerializer('bitstream-format'), 'id')
  uuid: string;
}
