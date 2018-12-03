import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { SearchResult } from '../../../+search-page/search-result.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { Metadatum } from '../../../core/shared/metadatum.model';
import { hasNoValue, isEmpty } from '../../empty.util';
import { ListableObject } from '../../object-collection/shared/listable-object.model';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { TruncatableService } from '../../truncatable/truncatable.service';

@Component({
  selector: 'ds-search-result-list-element',
  template: ``
})

export class SearchResultListElementComponent<T extends SearchResult<K>, K extends DSpaceObject> extends AbstractListableElementComponent<T> {
  dso: K;

  public constructor(@Inject('objectElementProvider') public listable: ListableObject, private truncatableService: TruncatableService) {
    super(listable);
    this.dso = this.object.dspaceObject;
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
      this.dso.filterMetadata(keys).forEach(
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
      result = this.dso.findMetadata(key);
    }
    return result;
  }

  isCollapsed(): Observable<boolean> {
    return this.truncatableService.isCollapsed(this.dso.id);
  }
}
