
import { CacheableObject } from '../cache/object-cache.reducer';
import { ResourceType } from './resource-type';

export class BitstreamFormat implements CacheableObject {

  shortDescription: string;

  description: string;

  mimetype: string;

  supportLevel: number;

  internal: boolean;

  extensions: string;

  self: string;

  type: ResourceType;

  uuid: string;

}
