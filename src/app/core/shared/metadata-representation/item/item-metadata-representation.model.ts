import { Item } from '../../item.model';
import { MetadataRepresentation, MetadataRepresentationType } from '../metadata-representation.model';
import { hasValue } from '../../../../shared/empty.util';

/**
 * An object to convert item types into the metadata field it should render for the item's primary value
 */
export const ItemTypeToPrimaryValue = {
  Default: 'dc.title',
  Person: 'dc.contributor.author'
};

/**
 * This class defines the way the item it extends should be represented as metadata
 */
export class ItemMetadataRepresentation extends Item implements MetadataRepresentation {

  /**
   * The type of item this item can be represented as
   */
  itemType: string;

  constructor(itemType: string) {
    super();
    this.itemType = itemType;
  }

  /**
   * Fetch the way this item should be rendered as in a list
   */
  get representationType(): MetadataRepresentationType {
    return MetadataRepresentationType.Item;
  }

  /**
   * Get the value to display, depending on the itemType
   */
  getPrimaryValue(): string {
    let metadata;
    if (hasValue(ItemTypeToPrimaryValue[this.itemType])) {
      metadata = ItemTypeToPrimaryValue[this.itemType];
    } else {
      metadata = ItemTypeToPrimaryValue.Default;
    }
    return this.findMetadata(metadata);
  }

}
