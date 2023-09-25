import { Component, Input } from '@angular/core';
import { MetadataRepresentation } from '../../../core/shared/metadata-representation/metadata-representation.model';
import { Context } from '../../../core/shared/context.model';

@Component({
    selector: 'ds-metadata-representation-list-element',
    template: '',
    standalone: true
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

  /**
   * Returns true if this component's value matches a basic regex "Is this an HTTP URL" test
   */
  isLink(): boolean {
    // Match any string that begins with http:// or https://
    const linkPattern = new RegExp(/^https?\/\/.*/);
    return linkPattern.test(this.mdRepresentation.getValue());
  }

}
