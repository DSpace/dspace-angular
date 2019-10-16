import { Component } from '@angular/core';
import { metadataRepresentationComponent } from '../../../../shared/metadata-representation/metadata-representation.decorator';
import { MetadataRepresentationType } from '../../../../core/shared/metadata-representation/metadata-representation.model';
import { ItemMetadataRepresentation } from '../../../../core/shared/metadata-representation/item/item-metadata-representation.model';

@metadataRepresentationComponent('Person', MetadataRepresentationType.Item)
@Component({
  selector: 'ds-person-item-metadata-list-element',
  templateUrl: './person-item-metadata-list-element.component.html'
})
/**
 * The component for displaying an item of the type Person as a metadata field
 */
export class PersonItemMetadataListElementComponent {
  metadataRepresentation: ItemMetadataRepresentation;
}
