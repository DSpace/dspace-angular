import { Component } from '@angular/core';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';

import { SearchResultListElementComponent } from '../search-result-list-element.component';
import { Collection } from '../../../../core/shared/collection.model';
import { SetViewMode } from '../../../view-mode';
import { CollectionSearchResult } from '../../../object-collection/shared/collection-search-result.model';

@Component({
  selector: 'ds-collection-search-result-list-element',
  styleUrls: ['../search-result-list-element.component.scss', 'collection-search-result-list-element.component.scss'],
  templateUrl: 'collection-search-result-list-element.component.html'
})

@renderElementsFor(CollectionSearchResult, SetViewMode.List)
export class CollectionSearchResultListElementComponent extends SearchResultListElementComponent<CollectionSearchResult, Collection> {}
