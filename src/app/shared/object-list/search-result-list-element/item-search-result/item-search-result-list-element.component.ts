import { Component } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { focusBackground } from '../../../animations/focus';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';
import { SearchResultListElementComponent } from '../search-result-list-element.component';
import { ViewMode } from '../../../../core/shared/view-mode.model';

@Component({
  selector: 'ds-item-search-result-list-element',
  styleUrls: ['../search-result-list-element.component.scss', 'item-search-result-list-element.component.scss'],
  templateUrl: 'item-search-result-list-element.component.html',
  animations: [focusBackground],

})

@renderElementsFor(ItemSearchResult, ViewMode.ListElement)
export class ItemSearchResultListElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> {
  viewMode = ViewMode.ListElement;

}
