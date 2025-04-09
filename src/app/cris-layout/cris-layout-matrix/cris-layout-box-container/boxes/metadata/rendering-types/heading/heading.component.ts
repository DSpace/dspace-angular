import { Component } from '@angular/core';

import { ComcolPageHeaderComponent } from '../../../../../../../shared/comcol/comcol-page-header/comcol-page-header.component';
import { RenderingTypeValueModelComponent } from '../rendering-type-value.model';

/**
 * This component renders the heading metadata fields
 */
@Component({
  selector: 'ds-heading-row',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss'],
  standalone: true,
  imports: [ComcolPageHeaderComponent],
})
export class HeadingComponent extends RenderingTypeValueModelComponent {

}
