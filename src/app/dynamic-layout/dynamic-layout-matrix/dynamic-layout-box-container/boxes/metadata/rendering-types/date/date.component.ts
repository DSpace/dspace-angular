import { Component } from '@angular/core';

import { ToDatePipe } from '../../../../../../../shared/access-control-form-container/access-control-array-form/to-date.pipe';
import { FieldRenderingType } from '../field-rendering-type';
import { metadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeValueDirective } from '../rendering-type-value.directive';

/**
 * This component renders the date metadata fields
 */
@metadataBoxFieldRendering(FieldRenderingType.DATE)
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'span[ds-date]',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  imports: [
    ToDatePipe,
  ],
})
export class DateComponent extends RenderingTypeValueDirective {

}
