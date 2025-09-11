import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { MetadataValuesComponent } from '../../../../field-components/metadata-values/metadata-values.component';
import { ItemPageFieldComponent } from '../item-page-field.component';

@Component({
  selector: 'ds-generic-item-page-field',
  templateUrl: '../item-page-field.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    MetadataValuesComponent,
  ],
})
/**
 * This component can be used to represent metadata on a simple item page.
 * It is the most generic way of displaying metadata values
 * It expects 4 parameters: The item, a separator, the metadata keys and an i18n key
 */
export class GenericItemPageFieldComponent extends ItemPageFieldComponent {

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
   * Whether the {@link MarkdownDirective} should be used to render this metadata.
   */
  @Input() enableMarkdown = false;

  /**
   * Whether any valid HTTP(S) URL should be rendered as a link
   */
  @Input() urlRegex?: string;


}
