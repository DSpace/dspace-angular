import { Component } from '@angular/core';

import { ComcolPageHeaderComponent } from '../../../../../../../shared/comcol/comcol-page-header/comcol-page-header.component';
import { FieldRenderingType } from '../field-rendering-type';
import { metadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeValueDirective } from '../rendering-type-value.directive';

/**
 * This component renders the heading metadata fields
 */
@metadataBoxFieldRendering(FieldRenderingType.HEADING)
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
