import { Component } from '@angular/core';
import { TypedItemSearchResultListElementComponent } from '../../../../shared/object-list/item-list-element/item-types/typed-item-search-result-list-element.component';
import { metadataRepresentationComponent } from '../../../../shared/metadata-representation/metadata-representation.decorator';
import { MetadataRepresentationType } from '../../../../core/shared/metadata-representation/metadata-representation.model';

@metadataRepresentationComponent('Project', MetadataRepresentationType.PlainText)
@Component({
  selector: 'ds-project-list-element',
  styleUrls: ['./project-list-element.component.scss'],
  templateUrl: './project-list-element.component.html'
})
/**
 * The component for displaying a list element for an item of the type Project
 */
export class ProjectListElementComponent extends TypedItemSearchResultListElementComponent {
}
