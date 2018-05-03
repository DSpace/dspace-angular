
import { autoserialize } from 'cerialize';

export class BitstreamFormat {

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
