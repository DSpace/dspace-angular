import { Component, Input } from '@angular/core';
import { hasNoValue, isEmpty } from '../../empty.util';
import { Metadatum } from '../../../core/shared/metadatum.model';
import { Item } from '../../../core/shared/item.model';
import { ItemStatus } from '../../../core/shared/item-status';
import { MyDSpaceResultListElementComponent } from '../my-dspace-result-list-element/my-dspace-result-list-element.component';
import { WorkspaceitemMyDSpaceResult } from '../../object-collection/shared/workspaceitem-my-dspace-result.model';
import { Workspaceitem } from '../../../core/submission/models/workspaceitem.model';
import { ListableObject } from '../../object-collection/shared/listable-object.model';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';

@Component({
  selector: 'ds-item-preview',
  styleUrls: ['item.preview.component.scss'],
  templateUrl: 'item-preview.component.html'
})

export class ItemPreviewComponent<T> {
  @Input()
  item: Item;
  @Input()
  object: any;
  @Input()
  statusTxt: string = ItemStatus.IN_PROGRESS; // Default value
  public ALL_STATUS = [];

  ngOnInit() {

    Object.keys(ItemStatus).forEach((s) => {
      this.ALL_STATUS.push(ItemStatus[s]);
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
