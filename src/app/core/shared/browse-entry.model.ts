import { autoserialize, autoserializeAs } from 'cerialize';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { ResourceType } from './resource-type';
import { resourceType } from './resource-type.decorator';
import { CacheableObject, TypedObject } from '../cache/object-cache.reducer';

@resourceType(ResourceType.BrowseEntry)
export class BrowseEntry implements ListableObject, TypedObject {

  @autoserialize
  type: ResourceType;

  @autoserialize
  authority: string;

  @autoserialize
  value: string;

  @autoserializeAs('valueLang')
  language: string;

  @autoserialize
  count: number;

}
