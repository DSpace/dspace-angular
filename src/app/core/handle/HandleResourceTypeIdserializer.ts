import {COLLECTION, COMMUNITY, ITEM, SITE} from './handle.resource-type';

/**
 * The ResourceTypeId of the Handle is number in the database but in the Handle table the user
 * must see meaningful information. This serializer convert that number to the string information and vice versa e.g.
 * resourceTypeId: 2 -> resourceTypeId: Item.
 */
export const HandleResourceTypeIdSerializer = {
  Serialize(resourceTypeId: string): number {
    switch (resourceTypeId) {
      case ITEM:
        return 2;
      case COLLECTION:
        return 3;
      case COMMUNITY:
        return 4;
      default:
        return null;
    }
  },

  Deserialize(resourceTypeId: number): string {
    switch (resourceTypeId) {
      case 2:
        return ITEM;
      case 3:
        return COLLECTION;
      case 4:
        return COMMUNITY;
      default:
        return SITE;
    }
  }
};
