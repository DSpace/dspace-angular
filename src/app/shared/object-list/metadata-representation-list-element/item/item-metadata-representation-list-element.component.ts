import { MetadataRepresentationListElementComponent } from '../metadata-representation-list-element.component';
import { Component } from '@angular/core';
import { ItemMetadataRepresentation } from '../../../../core/shared/metadata-representation/item/item-metadata-representation.model';

@Component({
  selector: 'ds-item-metadata-representation-list-element',
  template: ''
})
/**
 * An abstract class for displaying a single ItemMetadataRepresentation
 */
export class ItemMetadataRepresentationListElementComponent extends MetadataRepresentationListElementComponent {
  metadataRepresentation: ItemMetadataRepresentation;
}
