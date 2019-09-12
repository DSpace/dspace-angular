import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';
import { Item } from '../../../../core/shared/item.model';
import { SearchResultGridElementComponent } from '../../search-result-grid-element/search-result-grid-element.component';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { Component, Inject } from '@angular/core';
import { ITEM } from '../../../items/switcher/item-type-switcher.component';
import { hasValue } from '../../../empty.util';
import { MetadataMap } from '../../../../core/shared/metadata.models';

/**
 * A generic component for displaying item grid elements
 */
@Component({
  selector: 'ds-item-search-result-grid-element',
  template: ''
})
export class TypedItemSearchResultGridElementComponent extends SearchResultGridElementComponent<ItemSearchResult, Item> {
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
