import { Input } from '@angular/core';
import { hasValue } from 'src/app/shared/empty.util';

/**
 * This class defines the basic model to extends for create a new
 * field render component
 */
export class RenderingTypeModel {

  /**
   * Current DSpace item
   */
  @Input() item;
  /**
   * Current field
   */
  @Input() field;

  getMetadatavalue(key: string): any {
    return key ? this.item.firstMetadataValue(key) : '';
  }

  /**
   * Returns the value of the metadata to show
   */
  get metadataValue(): any {
    return this.item.firstMetadataValue(this.field.metadata);
  }

  /**
   * Returns true if the field has label, false otherwise
   */
  get hasLabel(): boolean {
    return hasValue(this.field.label);
  }

  /**
   * Returns a string representig the label of field if exists
   */
  get label(): string {
    return this.field.label;
  }

  /**
   * Returns a string representing the style of field if exists
   */
  get style(): string {
    return this.field.style;
  }
}
