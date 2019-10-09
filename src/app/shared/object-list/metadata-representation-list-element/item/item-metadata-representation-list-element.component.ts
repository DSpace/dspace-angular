import { MetadataRepresentationListElementComponent } from '../metadata-representation-list-element.component';
import { Component, Inject } from '@angular/core';
import { ITEM } from '../../../items/switcher/item-type-switcher.component';
import { MetadataRepresentation } from '../../../../core/shared/metadata-representation/metadata-representation.model';

@Component({
  selector: 'ds-item-metadata-representation-list-element',
  template: ''
})
/**
 * An abstract class for displaying a single ItemMetadataRepresentation
 */
export class ItemMetadataRepresentationListElementComponent extends MetadataRepresentationListElementComponent {
  constructor(@Inject(ITEM) public metadataRepresentation: MetadataRepresentation) {
    super(metadataRepresentation);
  }
}
