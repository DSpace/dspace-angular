import { Component } from '@angular/core';


import { SearchResultListElementComponent } from '../search-result-list-element.component';
import { Collection } from '../../../../core/shared/collection.model';
import { CollectionSearchResult } from '../../../object-collection/shared/collection-search-result.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { BrowseEntry } from '../../../../core/shared/browse-entry.model';

@Component({
  selector: 'ds-collection-search-result-list-element',
  styleUrls: ['../search-result-list-element.component.scss', 'collection-search-result-list-element.component.scss'],
  templateUrl: 'collection-search-result-list-element.component.html'
})

@listableObjectComponent(CollectionSearchResult.name, ViewMode.ListElement)
export class CollectionSearchResultListElementComponent extends SearchResultListElementComponent<CollectionSearchResult, Collection> {}
