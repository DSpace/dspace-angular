import { Component } from '@angular/core';

import { EscapeHtmlPipe } from '../../../../../../../shared/utils/escape-html.pipe';
import { FieldRenderingType } from '../field-rendering-type';
import { metadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeValueDirective } from '../rendering-type-value.directive';

/**
 * This component renders the text metadata fields
 */
@metadataBoxFieldRendering(FieldRenderingType.TEXT)
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'span[ds-text]',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  imports: [
    EscapeHtmlPipe,
  ],
})
export class TextComponent extends RenderingTypeValueDirective {

}
