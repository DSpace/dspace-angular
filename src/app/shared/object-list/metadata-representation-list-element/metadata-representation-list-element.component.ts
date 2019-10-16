import { Component } from '@angular/core';
import { MetadataRepresentation } from '../../../core/shared/metadata-representation/metadata-representation.model';

@Component({
  selector: 'ds-metadata-representation-list-element',
  template: ''
})
/**
 * An abstract class for displaying a single MetadataRepresentation
 */
export class MetadataRepresentationListElementComponent {
  /**
   * The metadata representation of this component
   */
  metadataRepresentation: MetadataRepresentation;
}
