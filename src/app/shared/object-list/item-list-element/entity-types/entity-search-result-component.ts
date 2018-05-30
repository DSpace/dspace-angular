import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Item } from '../../../../core/shared/item.model';
import { Metadatum } from '../../../../core/shared/metadatum.model';
import { hasNoValue, hasValue, isEmpty } from '../../../empty.util';
import { ITEM } from '../../../entities/switcher/entity-type-switcher.component';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';
import { TruncatableService } from '../../../truncatable/truncatable.service';

// TODO lot of overlap with SearchResultListElementComponent => refactor!
@Component({
  selector: 'ds-entity-search-result',
  template: ''
})
export class EntitySearchResultComponent {
  item: Item;
  searchResult: ItemSearchResult;

  constructor(
    private truncatableService: TruncatableService,
    @Inject(ITEM) public object: Item | ItemSearchResult,
  ) {

    if (hasValue((this.object as any).dspaceObject)) {
      this.searchResult = this.object as ItemSearchResult;
      this.item = this.searchResult.dspaceObject;
    } else {
      this.searchResult = {
        dspaceObject: this.object as Item,
        hitHighlights: []
      };
      this.item = this.object as Item;
    }
  }

  getValues(keys: string[]): string[] {
    const results: string[] = new Array<string>();
    this.searchResult.hitHighlights.forEach(
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
    this.searchResult.hitHighlights.some(
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

  isCollapsed(): Observable<boolean> {
    return this.truncatableService.isCollapsed(this.item.id);
  }
}
