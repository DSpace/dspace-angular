import { Component, Input } from '@angular/core';

import { Item } from '../../../core/shared/item.model';
import { fadeInOut } from '../../animations/fade';
import { MyDspaceItemStatusType } from '../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { Metadata } from '../../../core/shared/metadata.model';

@Component({
  selector: 'ds-item-list-preview',
  styleUrls: ['item-list-preview.component.scss'],
  templateUrl: 'item-list-preview.component.html',
  animations: [fadeInOut]
})

export class ItemListPreviewComponent {
  @Input() item: Item;
  @Input() object: any;
  @Input() status: MyDspaceItemStatusType;
  @Input() showSubmitter = false;

  /**
   * Gets all matching metadata string values from hitHighlights or dso metadata, preferring hitHighlights.
   *
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
   * @returns {string[]} the matching string values or an empty array.
   */
  allMetadataValues(keyOrKeys: string | string[]): string[] {
    return Metadata.allValues([this.object.hitHighlights, this.item.metadata], keyOrKeys);
  }

  /**
   * Gets the first matching metadata string value from hitHighlights or dso metadata, preferring hitHighlights.
   *
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
   * @returns {string} the first matching string value, or `undefined`.
   */
  firstMetadataValue(keyOrKeys: string | string[]): string {
    return Metadata.firstValue([this.object.hitHighlights, this.item.metadata], keyOrKeys);
  }

}
