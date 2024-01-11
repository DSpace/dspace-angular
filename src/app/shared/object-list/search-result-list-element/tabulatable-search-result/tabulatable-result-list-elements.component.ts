import { Component } from '@angular/core';
import {
  AbstractTabulatableElementComponent
} from '../../../object-collection/shared/objects-collection-tabulatable/objects-collection-tabulatable.component';
import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { SearchResult } from '../../../search/models/search-result.model';

@Component({
  selector: 'ds-search-result-list-element',
  template: ``
})
export class TabulatableResultListElementsComponent<T extends PaginatedList<K>, K extends SearchResult<any>> extends AbstractTabulatableElementComponent<T> {}
