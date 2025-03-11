import { Component } from '@angular/core';

import { MetadataLinkViewComponent } from '../../../../../../../shared/metadata-link-view/metadata-link-view.component';
import { RenderingTypeValueModelComponent } from '../rendering-type-value.model';

/**
 * This component renders the crisref metadata fields
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'span[ds-crisref]',
  templateUrl: './crisref.component.html',
  styleUrls: ['./crisref.component.scss'],
  standalone: true,
  imports: [MetadataLinkViewComponent],
})
export class CrisrefComponent extends RenderingTypeValueModelComponent {

}
