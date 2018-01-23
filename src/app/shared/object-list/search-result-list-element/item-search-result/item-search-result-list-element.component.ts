import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { SearchResultListElementComponent } from '../search-result-list-element.component';
import { Item } from '../../../../core/shared/item.model';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';
import { ViewMode } from '../../../../+search-page/search-options.model';
import { ListableObject } from '../../../object-collection/shared/listable-object.model';

@Component({
  selector: 'ds-item-search-result-list-element',
  styleUrls: ['../search-result-list-element.component.scss', 'item-search-result-list-element.component.scss'],
  templateUrl: 'item-search-result-list-element.component.html'
})

@renderElementsFor(ItemSearchResult, ViewMode.List)
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
