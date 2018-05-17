
import { CacheableObject } from '../cache/object-cache.reducer';
import { ResourceType } from './resource-type';

export class ResourcePolicy implements CacheableObject {

  action: string;

  name: string;

  // TODO group should ofcourse become a group object
  group: string;

  self: string;

  type: ResourceType;

  uuid: string;

}
