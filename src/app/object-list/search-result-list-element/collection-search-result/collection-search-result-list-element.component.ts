import { Component } from '@angular/core';

import { listElementFor } from '../../list-element-decorator';
import { CollectionSearchResult } from './collection-search-result.model';
import { SearchResultListElementComponent } from '../search-result-list-element.component';
import { Collection } from '../../../core/shared/collection.model';

@Component({
  selector: 'ds-collection-search-result-list-element',
  styleUrls: ['collection-search-result-list-element.component.scss'],
  templateUrl: 'collection-search-result-list-element.component.html'
})

@listElementFor(CollectionSearchResult)
export class CollectionSearchResultListElementComponent extends SearchResultListElementComponent<CollectionSearchResult, Collection> {}
