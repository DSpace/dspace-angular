import { Component, Input } from '@angular/core';

import { hasValue } from '../../../../../../shared/empty.util';
import { Item } from '../../../../../../core/shared/item.model';
import { TranslateService } from '@ngx-translate/core';
import { LayoutField } from '../../../../../../core/layout/models/box.model';
import { MetadataValue } from '../../../../../../core/shared/metadata.models';

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
   * The rendering sub-type, if exists
   * e.g. for type identifier.doi this property
   * contains the sub-type doi
   */
  @Input() renderingSubType: string;

  /**
   * Returns the value of the metadata to show
   */
  @Input() nested: boolean;

  @Input() indexToBeRendered;

  /**
   * The tab name
   */
  @Input() tabName: string;

  /**
   * The prefix used for box field label's i18n key
   */
  fieldI18nPrefix = 'layout.field.label.';

  constructor(protected translateService: TranslateService) {
  }

  /**
   * Returns all metadata values in the item
   */
  get metadataValues(): string[] {
    return this.field.metadata ? this.item.allMetadataValues(this.field.metadata) : [];
  }

  get metadata(): MetadataValue[] {
    return this.field.metadata ? this.item.allMetadata(this.field.metadata) : [];
  }

  /**
   * Returns true if the field has label, false otherwise
   */
  get hasLabel(): boolean {
    return hasValue(this.field.label);
  }

  /**
   * Returns a string representing the label of field if exists
   */
  get label(): string {
    const fieldLabelI18nKey = this.fieldI18nPrefix + this.field.label;
    const header: string = this.translateService.instant(fieldLabelI18nKey);
    if (header === fieldLabelI18nKey ) {
      // if translation does not exist return the value present in the header property
      return this.translateService.instant(this.field.label);
    } else {
      return header;
    }
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
    return this.field.styleValue || '';
  }
}
