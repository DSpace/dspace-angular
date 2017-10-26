import { Component } from '@angular/core';

import { gridElementFor } from '../../grid-element-decorator';
import { CollectionSearchResult } from './collection-search-result.model';
import { SearchResultGridElementComponent } from '../search-result-grid-element.component';
import { Collection } from '../../../core/shared/collection.model';

@Component({
  selector: 'ds-collection-search-result-grid-element',
  styleUrls: ['../search-result-grid-element.component.scss', 'collection-search-result-grid-element.component.scss'],
  templateUrl: 'collection-search-result-grid-element.component.html'
})

@gridElementFor(CollectionSearchResult)
export class CollectionSearchResultGridElementComponent extends SearchResultGridElementComponent<CollectionSearchResult, Collection> {}
