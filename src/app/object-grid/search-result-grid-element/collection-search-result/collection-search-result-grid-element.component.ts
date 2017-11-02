import { Component } from '@angular/core';

import { renderElementsFor} from '../../../object-collection/shared/dso-element-decorator';

import { CollectionSearchResult } from './collection-search-result.model';
import { SearchResultGridElementComponent } from '../search-result-grid-element.component';
import { Collection } from '../../../core/shared/collection.model';
import { ViewMode } from '../../../+search-page/search-options.model';

@Component({
  selector: 'ds-collection-search-result-grid-element',
  styleUrls: ['../search-result-grid-element.component.scss', 'collection-search-result-grid-element.component.scss'],
  templateUrl: 'collection-search-result-grid-element.component.html'
})

@renderElementsFor(CollectionSearchResult, ViewMode.Grid)
export class CollectionSearchResultGridElementComponent extends SearchResultGridElementComponent<CollectionSearchResult, Collection> {}
