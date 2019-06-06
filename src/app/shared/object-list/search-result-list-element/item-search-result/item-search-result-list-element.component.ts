import { Component } from '@angular/core';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { Item } from '../../../../core/shared/item.model';
import { focusBackground } from '../../../animations/focus';
import { hasValue } from '../../../empty.util';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';
import { SetViewMode } from '../../../view-mode';
import { SearchResultListElementComponent } from '../search-result-list-element.component';
import { ItemViewMode } from '../../../items/item-type-decorator';

@Component({
  selector: 'ds-item-search-result-list-element',
  styleUrls: ['../search-result-list-element.component.scss', 'item-search-result-list-element.component.scss'],
  templateUrl: 'item-search-result-list-element.component.html',
  animations: [focusBackground],

})

@renderElementsFor(ItemSearchResult, SetViewMode.List)
export class ItemSearchResultListElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> {
  viewMode = ItemViewMode.Element;

}
