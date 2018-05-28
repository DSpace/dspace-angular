import { Component } from '@angular/core';

import { renderElementsFor} from '../../../object-collection/shared/dso-element-decorator';
import { SearchResultGridElementComponent } from '../search-result-grid-element.component';
import { Collection } from '../../../../core/shared/collection.model';
import { SetViewMode } from '../../../view-mode';
import { CollectionSearchResult } from '../../../object-collection/shared/collection-search-result.model';

@Component({
  selector: 'ds-collection-search-result-grid-element',
  styleUrls: ['../search-result-grid-element.component.scss', 'collection-search-result-grid-element.component.scss'],
  templateUrl: 'collection-search-result-grid-element.component.html'
})

@renderElementsFor(CollectionSearchResult, SetViewMode.Grid)
export class CollectionSearchResultGridElementComponent extends SearchResultGridElementComponent<CollectionSearchResult, Collection> {}
