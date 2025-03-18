import { Item } from './item.model';
import { ItemRequest } from './item-request.model';

/**
 * This model represents an item with supplementary data, e.g. an ItemRequest object
 * to help components determine how the Item or its data/bitstream should be delivered
 * and presented to the users, but not part of the actual database model.
 */
export class ItemWithSupplementaryData extends Item {
  /**
   * An item request. This is used to determine how the item should be delivered.
   * A valid accessToken is resolved to this object in the accessTokenResolver
   */
  itemRequest: ItemRequest;

  constructor(itemRequest: ItemRequest) {
    super();
    this.itemRequest = itemRequest;
  }
}
