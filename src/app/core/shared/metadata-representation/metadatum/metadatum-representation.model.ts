import { MetadataRepresentation, MetadataRepresentationType } from '../metadata-representation.model';
import { hasValue } from '../../../../shared/empty.util';
import { MetadataValue } from '../../metadata.models';

/**
 * This class defines the way the metadatum it extends should be represented
 */
export class MetadatumRepresentation extends MetadataValue implements MetadataRepresentation {

  /**
   * The type of item this metadatum can be represented as
   */
  itemType: string;

  constructor(itemType: string) {
    super();
    this.itemType = itemType;
  }

  /**
   * Fetch the way this metadatum should be rendered as in a list
   */
  get representationType(): MetadataRepresentationType {
    if (hasValue(this.authority)) {
      return MetadataRepresentationType.AuthorityControlled;
    } else {
      return MetadataRepresentationType.PlainText;
    }
  }

  /**
   * Get the value to display
   */
  getValue(): string {
    return this.value;
  }

}
