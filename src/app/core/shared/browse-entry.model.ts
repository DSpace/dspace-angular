import { autoserialize, autoserializeAs } from 'cerialize';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { ResourceType } from './resource-type';
import { resourceType } from './resource-type.decorator';
import { TypedObject } from '../cache/object-cache.reducer';

/**
 * Class object representing a browse entry
 * This class is not normalized because browse entries do not have self links
 */
@resourceType(ResourceType.BrowseEntry)
export class BrowseEntry implements ListableObject, TypedObject {
  /**
   * The resource type of this browse entry
   */
  @autoserialize
  type: ResourceType;

  /**
   * The authority string of this browse entry
   */
  @autoserialize
  authority: string;

  /**
   * The value of this browse entry
   */
  @autoserialize
  value: string;

  /**
   * The language of the value of this browse entry
   */
  @autoserializeAs('valueLang')
  language: string;

  /**
   * The count of this browse entry
   */
  @autoserialize
  count: number;
}
