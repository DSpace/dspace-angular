import { DSpaceObject } from './dspace-object.model';

export class BitstreamFormat extends DSpaceObject {

  shortDescription: string;

  description: string;

  mimetype: string;

  supportLevel: number;

  internal: boolean;

  extensions: string;

}
