import {
  Component,
  OnChanges,
} from '@angular/core';

import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../object-collection/shared/listable-object/listable-object.decorator';
import { AbstractListableElementComponent } from '../../../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { Item } from '../../../../../core/shared/item.model';
import { ItemSearchResult } from '../../../../object-collection/shared/item-search-result.model';
import { hasValue } from '../../../../empty.util';

@listableObjectComponent('Publication', ViewMode.ListElement)
@listableObjectComponent(Item, ViewMode.ListElement)
@Component({
  selector: 'ds-item-list-element',
  styleUrls: ['./item-list-element.component.scss'],
  templateUrl: './item-list-element.component.html'
})
/**
 * The component for displaying a list element for an item of the type Publication
 */
export class ItemListElementComponent extends AbstractListableElementComponent<Item> implements OnChanges {

  itemSearchResult: ItemSearchResult;

  ngOnChanges(): void {
    if (hasValue(this.object)) {
      this.itemSearchResult = Object.assign(new ItemSearchResult(), {
        indexableObject: this.object,
      });
    }
  }

}
