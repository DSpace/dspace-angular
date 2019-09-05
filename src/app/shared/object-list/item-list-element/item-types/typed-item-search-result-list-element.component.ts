import { Component, Inject } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { hasValue } from '../../../empty.util';
import { ITEM } from '../../../items/switcher/item-type-switcher.component';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { SearchResultListElementComponent } from '../../search-result-list-element/search-result-list-element.component';
import { MetadataMap } from '../../../../core/shared/metadata.models';

/**
 * A generic component for displaying item list elements
 */
@Component({
  selector: 'ds-item-search-result-list-element',
  template: ''
})
export class TypedItemSearchResultListElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> {
  item: Item;

  constructor(
    protected truncatableService: TruncatableService,
    @Inject(ITEM) public obj: Item | ItemSearchResult,
  ) {
    super(undefined, truncatableService);
    if (hasValue((obj as any).indexableObject)) {
      this.object = obj as ItemSearchResult;
      this.dso = this.object.indexableObject;
    } else {
      this.object = {
        indexableObject: obj as Item,
        hitHighlights: new MetadataMap()
      };
      this.dso = obj as Item;
    }
    this.item = this.dso;
  }
}
