import { Component } from '@angular/core';
import { AbstractListableElementComponent } from '../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';
import { Item } from '../../../../core/shared/item.model';
import { metadataRepresentationComponent } from '../../../../shared/metadata-representation/metadata-representation.decorator';
import { MetadataRepresentationType } from '../../../../core/shared/metadata-representation/metadata-representation.model';
import { MetadataRepresentationListElementComponent } from '../../../../shared/object-list/metadata-representation-list-element/metadata-representation-list-element.component';
import { ItemMetadataRepresentation } from '../../../../core/shared/metadata-representation/item/item-metadata-representation.model';

@metadataRepresentationComponent('Person', MetadataRepresentationType.Item)
@Component({
  selector: 'ds-person-item-page-list-element',
  templateUrl: './person-item-page-list-element.component.html'
})
/**
 * The component for displaying a list element for an item of the type Person
 */
export class PersonItemPageListElementComponent {
  metadataRepresentation: ItemMetadataRepresentation;
}
