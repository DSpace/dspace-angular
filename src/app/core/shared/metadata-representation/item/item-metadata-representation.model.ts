import { Item } from '../../item.model';
import { MetadataRepresentation, MetadataRepresentationType } from '../metadata-representation.model';
import { hasValue } from '../../../../shared/empty.util';

/**
 * An object to convert item types into the metadata field it should render for the item's value
 */
export const ItemTypeToValue = {
  Default: 'dc.title',
  Person: 'dc.contributor.author',
  OrgUnit: 'dc.title'
};

/**
 * This class determines which fields to use when rendering an Item as a metadata value.
 */
export class ItemMetadataRepresentation extends Item implements MetadataRepresentation {

  /**
   * The type of item this item can be represented as
   */
  get itemType(): string {
    return this.firstMetadataValue('relationship.type');
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
  getValue(): string {
    let metadata;
    if (hasValue(ItemTypeToValue[this.itemType])) {
      metadata = ItemTypeToValue[this.itemType];
    } else {
      metadata = ItemTypeToValue.Default;
    }
    return this.firstMetadataValue(metadata);
  }

}
