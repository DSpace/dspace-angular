import { Component, Inject } from '@angular/core';
import { MetadataRepresentation } from '../../../core/shared/metadata-representation/metadata-representation.model';
import { ITEM } from '../../items/switcher/item-type-switcher.component';

@Component({
  selector: 'ds-metadata-representation-list-element',
  template: ''
})
/**
 * An abstract class for displaying a single MetadataRepresentation
 */
export class MetadataRepresentationListElementComponent {
  constructor(@Inject(ITEM) public metadataRepresentation: MetadataRepresentation) {
  }
}
