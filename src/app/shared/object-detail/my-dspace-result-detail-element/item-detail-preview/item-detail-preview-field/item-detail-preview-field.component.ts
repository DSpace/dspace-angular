import {
  Component,
  Input,
} from '@angular/core';
import { Item } from '@dspace/core/shared/item.model';
import { Metadata } from '@dspace/core/shared/metadata.utils';
import { SearchResult } from '@dspace/core/shared/search/models/search-result.model';
import { TranslateModule } from '@ngx-translate/core';

import { MetadataValue } from '../../../../../core/shared/metadata.models';
import { MetadataDirective } from '../../../../metadata.directive';
import { MetadataFieldWrapperComponent } from '../../../../metadata-field-wrapper/metadata-field-wrapper.component';
import { allMetadataWithHitHighlights } from '../../../../utils/highlighted-metadata.util';

/**
 * This component show values for the given item metadata
 */
@Component({
  selector: 'ds-base-item-detail-preview-field',
  templateUrl: './item-detail-preview-field.component.html',
  imports: [
    MetadataDirective,
    MetadataFieldWrapperComponent,
    TranslateModule,
  ],
})
export class ItemDetailPreviewFieldComponent {

  /**
   * The item to display
   */
  @Input() item: Item;

  /**
   * The search result object
   */
  @Input() object: SearchResult<any>;

  /**
   * The metadata label
   */
  @Input() label: string;

  /**
   * The metadata to show
   */
  @Input() metadata: string | string[];

  /**
   * Escape HTML in the metadata value
   */
  @Input() escapeMetadataHTML: boolean;

  /**
   * The placeholder if there are no value to show
   */
  @Input() placeholder: string;

  /**
   * The value's separator
   */
  @Input() separator: string;


  /**
   * Gets all matching metadata values from hitHighlights or dso metadata.
   *
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
   * @returns {MetadataValue[]} the matching values or an empty array.
   */
  allMetadata(keyOrKeys: string | string[]): MetadataValue[] {
    return allMetadataWithHitHighlights(this.item.metadata, this.object.hitHighlights, keyOrKeys);
  }

  /**
   * Gets all matching metadata string values from hitHighlights or dso metadata, preferring hitHighlights.
   *
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
   * @returns {string[]} the matching string values or an empty array.
   */
  allMetadataValues(keyOrKeys: string | string[]): string[] {
    return Metadata.allValues(this.item.metadata, keyOrKeys, this.object.hitHighlights, undefined, this.escapeMetadataHTML);
  }
}
