import { Component } from '@angular/core';
import { SearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/search-result-list-element.component';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { metadataRepresentationComponent } from '../../../../../shared/metadata-representation/metadata-representation.decorator';
import { MetadataRepresentationType } from '../../../../../core/shared/metadata-representation/metadata-representation.model';
import { Item } from '../../../../../core/shared/item.model';

@metadataRepresentationComponent('ProjectSearchResult', MetadataRepresentationType.PlainText)
@Component({
  selector: 'ds-project-search-result-list-element',
  styleUrls: ['./project-search-result-list-element.component.scss'],
  templateUrl: './project-search-result-list-element.component.html'
})
/**
 * The component for displaying a list element for an item of the type Project
 */
export class ProjectSearchResultListElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> {
}
