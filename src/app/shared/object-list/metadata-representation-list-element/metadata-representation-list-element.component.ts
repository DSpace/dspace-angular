import { Component, Input } from '@angular/core';
import { MetadataRepresentation } from '../../../core/shared/metadata-representation/metadata-representation.model';
import { Context } from '../../../core/shared/context.model';

@Component({
  selector: 'ds-metadata-representation-list-element',
  template: ''
})
/**
 * An abstract class for displaying a single MetadataRepresentation
 */
export class MetadataRepresentationListElementComponent {
  /**
   * The optional context
   */
  @Input() context: Context;

  /**
   * The metadata representation of this component
   */
  @Input() mdRepresentation: MetadataRepresentation;
}
