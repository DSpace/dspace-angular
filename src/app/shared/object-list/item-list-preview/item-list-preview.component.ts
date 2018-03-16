import { Component, Input } from '@angular/core';
import { hasNoValue, isEmpty, isNotEmpty } from '../../empty.util';
import { Metadatum } from '../../../core/shared/metadatum.model';
import { Item } from '../../../core/shared/item.model';
import { fadeInOut } from '../../animations/fade';
import { ItemStatusType } from '../item-list-status/item-status-type';

@Component({
  selector: 'ds-item-list-preview',
  styleUrls: ['item-list-preview.component.scss'],
  templateUrl: 'item-list-preview.component.html',
  animations: [fadeInOut]
})

export class ItemListPreviewComponent {
  @Input()
  item: Item;
  @Input()
  object: any;
  @Input()
  status: ItemStatusType;

  getTitle(): string {
    return this.item.findMetadata('dc.title');
  }

  getDate(): string {
    return this.item.findMetadata('dc.date.issued');
  }

  getValues(keys: string[]): string[] {
    const results: string[] = new Array<string>();
    if (this.object && this.object.hitHighlights) {
      this.object.hitHighlights.forEach(
        (md: Metadatum) => {
          if (keys.indexOf(md.key) > -1) {
            results.push(md.value);
          }
        }
      );
    }
    if (isEmpty(results)) {
      this.item.filterMetadata(keys).forEach(
        (md: Metadatum) => {
          results.push(md.value);
        }
      );
    }
    return results;
  }

  getFirstValue(key: string): string {
    let result: string;
    if (isNotEmpty(this.object.hitHighlights)) {
      this.object.hitHighlights.some(
        (md: Metadatum) => {
          if (key === md.key) {
            result = md.value;
            return true;
          }
        }
      );
    }
    if (hasNoValue(result)) {
      result = this.item.findMetadata(key);
    }
    return result;
  }

}
