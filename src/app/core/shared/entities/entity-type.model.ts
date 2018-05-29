import { CacheableObject } from '../../cache/object-cache.reducer';
import { ResourceType } from '../resource-type';

export class EntityType implements CacheableObject {
  id: string;
  self: string;
  type: ResourceType;
  uuid: string;
}
