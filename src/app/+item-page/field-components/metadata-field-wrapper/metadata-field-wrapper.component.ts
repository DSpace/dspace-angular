import { Component, Input } from '@angular/core';
import { hasNoValue } from '../../../shared/empty.util';

/**
 * This component renders any content inside this wrapper.
 * The wrapper prints a label before the content (if available)
 */
@Component({
  selector: 'ds-metadata-field-wrapper',
  styleUrls: ['./metadata-field-wrapper.component.scss'],
  templateUrl: './metadata-field-wrapper.component.html'
})
export class MetadataFieldWrapperComponent {

  /**
   * The label (title) for the content
   */
  @Input() label: string;

  /**
   * Make hasNoValue() available in the template
   */
  hasNoValue(o: any): boolean {
    return hasNoValue(o);
  }
}
