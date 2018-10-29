import { Component, Input } from '@angular/core';
import { Metadatum } from '../../../core/shared/metadatum.model';

/**
 * This component renders the configured 'values' into the ds-metadata-field-wrapper component.
 * It puts the given 'separator' between each two values.
 */
@Component({
  selector: 'ds-metadata-values',
  styleUrls: ['./metadata-values.component.scss'],
  templateUrl: './metadata-values.component.html'
})
export class MetadataValuesComponent {

  @Input() values: Metadatum[];

  @Input() separator: string;

  @Input() label: string;

}
