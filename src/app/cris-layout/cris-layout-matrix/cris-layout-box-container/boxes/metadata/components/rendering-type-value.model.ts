import { Component, Inject, Input, Optional } from '@angular/core';

import { isNotEmpty } from '../../../../../../shared/empty.util';
import { PLACEHOLDER_PARENT_METADATA } from '../../../../../../shared/form/builder/ds-dynamic-form-ui/ds-dynamic-form-constants';
import { Item } from '../../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../../core/layout/models/metadata-component.model';

/**
 * This class defines the basic model to extends for create a new
 * field render component
 */
@Component({
  template: ''
})
export abstract class RenderingTypeValueModelComponent {

  /**
   * Current DSpace item
   */
  @Input() metadataValue: any;
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
  @Input() renderingSubType: string;

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Optional() @Inject('metadataValueProvider') public metadataValueProvider: any,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
  ) {
    this.field = fieldProvider;
    this.item = itemProvider;
    this.metadataValue = metadataValueProvider;
    this.renderingSubType = renderingSubTypeProvider;
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
