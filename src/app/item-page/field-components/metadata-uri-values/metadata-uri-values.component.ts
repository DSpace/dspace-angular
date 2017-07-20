import { Component, Input } from '@angular/core';

import { MetadataValuesComponent } from '../metadata-values/metadata-values.component';

/**
 * This component renders the configured 'values' into the ds-metadata-field-wrapper component as a link.
 * It puts the given 'separator' between each two values
 * and creates an 'a' tag for each value,
 * using the 'linktext' as it's value (if it exists)
 * and using the values as the 'href' attribute (and as value of the tag when no 'linktext' is defined)
 */
@Component({
  selector: 'ds-metadata-uri-values',
  styleUrls: ['./metadata-uri-values.component.scss'],
  templateUrl: './metadata-uri-values.component.html'
})
export class MetadataUriValuesComponent extends MetadataValuesComponent {

  @Input() linktext: any;

  @Input() values: any;

  @Input() separator: string;

  @Input() label: string;
}
