import { Component } from '@angular/core';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';

import { SearchResultListElementComponent } from '../search-result-list-element.component';
import { Collection } from '../../../../core/shared/collection.model';
import { CollectionSearchResult } from '../../../object-collection/shared/collection-search-result.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';

@Component({
  selector: 'ds-collection-search-result-list-element',
  styleUrls: ['../search-result-list-element.component.scss', 'collection-search-result-list-element.component.scss'],
  templateUrl: 'collection-search-result-list-element.component.html'
})

@renderElementsFor(CollectionSearchResult, ViewMode.List)
export class CollectionSearchResultListElementComponent extends SearchResultListElementComponent<CollectionSearchResult, Collection> {}
