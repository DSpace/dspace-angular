import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { ItemType } from '../../../shared/item-relationships/item-type.model';
import { mapsTo } from '../../builders/build-decorators';
import { NormalizedObject } from '../normalized-object.model';
import { IDToUUIDSerializer } from '../../id-to-uuid-serializer';

/**
 * Normalized model class for a DSpace ItemType
 */
@mapsTo(ItemType)
@inheritSerialization(NormalizedObject)
export class NormalizedItemType extends NormalizedObject<ItemType> {
  /**
   * The label that describes the ResourceType of the Item
   */
  @autoserialize
  label: string;

  /**
   * The identifier of this ItemType
   */
  @autoserialize
  id: string;

  /**
   * The universally unique identifier of this ItemType
   */
  @autoserializeAs(new IDToUUIDSerializer(ItemType.type.value), 'id')
  uuid: string;
}
