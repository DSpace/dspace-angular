import { Component, Input } from '@angular/core';

import { hasValue, isNotEmpty } from '../../../../shared/empty.util';
import { Item } from '../../../../core/shared/item.model';
import { LayoutField } from '../../../../core/layout/models/metadata-component.model';
import { PLACEHOLDER_PARENT_METADATA } from '../../../../shared/form/builder/ds-dynamic-form-ui/ds-dynamic-form-constants';

/**
 * This class defines the basic model to extends for create a new
 * field render component
 */
@Component({
  template: ''
})
export abstract class RenderingTypeModelComponent {

  /**
   * Current DSpace item
   */
  @Input() item: Item;
  /**
   * Current field
   */
  @Input() field: LayoutField;
  /**
   * Defines the subtype of a rendering.
   * ex. for type identifier.doi this property
   * contains the subtype doi
   */
  @Input() subtype: string;

  /**
   * Returns the value of the metadata to show
   */

  @Input() nested: boolean;
  @Input() indexToBeRendered;
  get metadataValues(): string[] {
    return this.item.allMetadataValues(this.field.metadata);
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

  /**
   * Normalize value to display
   * @param value
   */
  normalizeValue(value: string): string {
    if (isNotEmpty(value) && value.includes(PLACEHOLDER_PARENT_METADATA)) {
      return '';
    } else {
      return value;
    }
  }
}
