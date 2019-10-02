import { Component, Inject } from '@angular/core';
import { MetadataRepresentation } from '../../../core/shared/metadata-representation/metadata-representation.model';
import { ITEM } from '../../items/switcher/listable-object-component-loader.component';

@Component({
  selector: 'ds-metadata-representation-list-element',
  template: ''
})
/**
 * An abstract class for displaying a single MetadataRepresentation
 */
export class MetadataRepresentationListElementComponent {
  metadataRepresentation: MetadataRepresentation;

  constructor() {
  }
}
