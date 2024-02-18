import { Component, Input } from '@angular/core';
import { ImageField, ItemPageFieldComponent } from '../item-page-field.component';
import { Item } from '../../../../../core/shared/item.model';

@Component({
  selector: 'ds-item-page-img-field',
  templateUrl: '../item-page-field.component.html'
})
/**
 * Component that renders an inline image for a given field.
 * This component uses a given {@code ImageField} configuration to correctly render the img.
 */
export class ItemPageImgFieldComponent extends ItemPageFieldComponent {

  /**
   * The item to display metadata for
   */
  @Input() item: Item;

  /**
   * Separator string between multiple values of the metadata fields defined
   * @type {string}
   */
  @Input() separator: string;

  /**
   * Fields (schema.element.qualifier) used to render their values.
   */
  @Input() fields: string[];

  /**
   * Label i18n key for the rendered metadata
   */
  @Input() label: string;

  /**
   * Image Configuration
   */
  @Input() img: ImageField;

  /**
   * Whether any valid HTTP(S) URL should be rendered as a link
   */
  @Input() urlRegex?: string;

}
