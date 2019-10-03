import { Component } from '@angular/core';
import { metadataRepresentationComponent } from '../../../../shared/metadata-representation/metadata-representation.decorator';
import { MetadataRepresentationType } from '../../../../core/shared/metadata-representation/metadata-representation.model';
import { AbstractListableElementComponent } from '../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';
import { Item } from '../../../../core/shared/item.model';

@metadataRepresentationComponent('Project', MetadataRepresentationType.PlainText)
@Component({
  selector: 'ds-project-list-element',
  styleUrls: ['./project-list-element.component.scss'],
  templateUrl: './project-list-element.component.html'
})
/**
 * The component for displaying a list element for an item of the type Project
 */
export class ProjectListElementComponent extends AbstractListableElementComponent<Item> {
}
