import { Component } from '@angular/core';

import { ComcolPageHeaderComponent } from '../../../../../../../shared/comcol/comcol-page-header/comcol-page-header.component';
import { RenderingTypeValueDirective } from '../rendering-type-value.directive';

/**
 * This component renders the heading metadata fields
 */
@Component({
  selector: 'ds-heading-row',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss'],
  imports: [
    ComcolPageHeaderComponent,
  ],
})
export class HeadingComponent extends RenderingTypeValueDirective {

}
