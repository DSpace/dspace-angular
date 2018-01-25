import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { SearchResultListElementComponent } from '../search-result-list-element.component';
import { Item } from '../../../../core/shared/item.model';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';
import { ViewMode } from '../../../../+search-page/search-options.model';
import { ListableObject } from '../../../object-collection/shared/listable-object.model';
import { focusBackground } from '../../../animations/focus';

@Component({
  selector: 'ds-item-search-result-list-element',
  styleUrls: ['../search-result-list-element.component.scss', 'item-search-result-list-element.component.scss'],
  templateUrl: 'item-search-result-list-element.component.html',
  animations: [focusBackground],

})

@renderElementsFor(ItemSearchResult, ViewMode.List)
export class ItemSearchResultListElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> {
}
