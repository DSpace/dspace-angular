import { Component } from '@angular/core';

import { EscapeHtmlPipe } from '../../../../../../../shared/utils/escape-html.pipe';
import { RenderingTypeValueModelComponent } from '../rendering-type-value.model';

/**
 * This component renders the text metadata fields
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'span[ds-text]',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  imports: [
    EscapeHtmlPipe,
  ],
})
export class TextComponent extends RenderingTypeValueModelComponent {

}
