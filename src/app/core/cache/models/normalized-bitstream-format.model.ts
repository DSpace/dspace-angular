import { inheritSerialization, autoserialize } from 'cerialize';

import { mapsTo } from '../builders/build-decorators';

import { BitstreamFormat } from '../../shared/bitstream-format.model';
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

}
