import { Input } from '@angular/core';
import { hasValue } from 'src/app/shared/empty.util';
import { Item } from 'src/app/core/shared/item.model';
import { Field } from 'src/app/core/layout/models/metadata-component.model';

/**
 * This class defines the basic model to extends for create a new
 * field render component
 */
export class RenderingTypeModel {

  /**
   * Current DSpace item
   */
  @Input() item: Item;
  /**
   * Current field
   */
  @Input() field: Field;
  /**
   * Defines the subtype of a rendering.
   * ex. for type identifier.doi this property
   * contains the subtype doi
   */
  @Input() subtype: string;

  getMetadatavalue(key: string): any {
    return key ? this.item.firstMetadataValue(key) : '';
  }

  /**
   * Returns the value of the metadata to show
   */
  get metadataValue(): string {
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
   * Returns a string representing the style of field container if exists
   */
  get containerStyle(): string {
    return this.field.style;
  }

  /**
   * Returns a string representing the style of field label if exists
   */
  get labelStyle(): string {
    return this.field.styleLabel;
  }

  /**
   * Returns a string representing the style of field value if exists
   */
  get valueStyle(): string {
    return this.field.styleValue;
  }
}
