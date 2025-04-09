import { Component } from '@angular/core';

import { RenderingTypeValueModelComponent } from '../rendering-type-value.model';

/**
 * This component renders the text metadata fields
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'span[ds-text]',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  standalone: true,
})
export class TextComponent extends RenderingTypeValueModelComponent {

}
