import { Component } from '@angular/core';

import { MetadataLinkViewComponent } from '../../../../../../../shared/metadata-link-view/metadata-link-view.component';
import { RenderingTypeValueDirective } from '../rendering-type-value.directive';

/**
 * This component renders the dynamicref metadata fields
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'span[ds-dynamicref]',
  templateUrl: './dynamicref.component.html',
  styleUrls: ['./dynamicref.component.scss'],
  imports: [
    MetadataLinkViewComponent,
  ],
})
export class DynamicrefComponent extends RenderingTypeValueDirective {

}
