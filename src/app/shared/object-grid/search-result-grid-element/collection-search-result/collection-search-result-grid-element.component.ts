import { Component } from '@angular/core';

import { Collection } from '../../../../core/shared/collection.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { CollectionSearchResult } from '../../../object-collection/shared/collection-search-result.model';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { SearchResultGridElementComponent } from '../search-result-grid-element.component';

@Component({
  selector: 'ds-collection-search-result-grid-element',
  styleUrls: ['../search-result-grid-element.component.scss', 'collection-search-result-grid-element.component.scss'],
  templateUrl: 'collection-search-result-grid-element.component.html'
})

@renderElementsFor(CollectionSearchResult, ViewMode.Grid)
export class CollectionSearchResultGridElementComponent extends SearchResultGridElementComponent<CollectionSearchResult, Collection> {}
