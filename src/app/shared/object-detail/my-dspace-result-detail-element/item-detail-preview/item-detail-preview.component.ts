import { Component, Input } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { ItemStatusType } from '../../../object-list/item-list-status/item-status-type';
import { Metadatum } from '../../../../core/shared/metadatum.model';
import { hasNoValue, isEmpty } from '../../../empty.util';
import { fadeInOut } from '../../../animations/fade';

@Component({
  selector: 'ds-item-detail-preview',
  styleUrls: ['./item-detail-preview.component.scss'],
  templateUrl: './item-detail-preview.component.html',
  animations: [fadeInOut]
})
export class ItemDetailPreviewComponent<T> {

  @Input() item: Item;
  @Input() object: any;
  @Input() status: ItemStatusType;
  public ALL_STATUS = [];

  ngOnInit() {
    Object.keys(ItemStatusType).forEach((s) => {
      this.ALL_STATUS.push(ItemStatusType[s]);
    });

  }

  getTitle(): string {
    return this.item.findMetadata('dc.title');
  }

  getDate(): string {
    return this.item.findMetadata('dc.date.issued');
  }

  getValues(keys: string[]): string[] {
    const results: string[] = new Array<string>();
    this.object.hitHighlights.forEach(
      (md: Metadatum) => {
        if (keys.indexOf(md.key) > -1) {
          results.push(md.value);
        }
      }
    );
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
    this.object.hitHighlights.some(
      (md: Metadatum) => {
        if (key === md.key) {
          result = md.value;
          return true;
        }
      }
    );
    if (hasNoValue(result)) {
      result = this.item.findMetadata(key);
    }
    return result;
  }

}
