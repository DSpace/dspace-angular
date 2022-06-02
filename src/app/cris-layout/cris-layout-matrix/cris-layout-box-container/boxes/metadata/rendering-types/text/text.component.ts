import { Component } from '@angular/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeValueModelComponent } from '../rendering-type-value.model';

/**
 * This component renders the text metadata fields
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'span[ds-text]',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.TEXT)
export class TextComponent extends RenderingTypeValueModelComponent {

}
