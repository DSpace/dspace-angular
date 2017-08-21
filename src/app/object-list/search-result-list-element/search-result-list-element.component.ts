import { Component, Inject } from '@angular/core';

import { ObjectListElementComponent } from '../object-list-element/object-list-element.component';
import { ListableObject } from '../listable-object/listable-object.model';
import { SearchResult } from '../../search/search-result.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';

@Component({
  selector: 'ds-search-result-list-element',
  template: ``
})

export class SearchResultListElementComponent<T extends SearchResult<K>, K extends DSpaceObject> extends ObjectListElementComponent<T> {
  dso: K;
  public constructor(@Inject('objectElementProvider') public listable: ListableObject) {
    super(listable);
    this.dso = this.object.dspaceObject;
  }
}
