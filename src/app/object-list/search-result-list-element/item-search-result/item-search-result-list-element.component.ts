import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';

import { listElementFor } from '../../list-element-decorator';
import { ItemSearchResult } from './item-search-result.model';
import { SearchResultListElementComponent } from '../search-result-list-element.component';
import { Item } from '../../../core/shared/item.model';
import { ListableObject } from '../../listable-object/listable-object.model';

@Component({
  selector: 'ds-item-search-result-list-element',
  styleUrls: ['../search-result-list-element.component.scss', 'item-search-result-list-element.component.scss'],
  templateUrl: 'item-search-result-list-element.component.html',
})

@listElementFor(ItemSearchResult)
export class ItemSearchResultListElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> implements OnInit {
  lines = 3;

  constructor(@Inject('objectElementProvider') public listable: ListableObject, private changeDetectorRef: ChangeDetectorRef) {
    super(listable);
  }

  ngOnInit() {
    setTimeout(() => {
      this.lines = 4;
      this.changeDetectorRef.detectChanges();
    }, 0);
  }
}
