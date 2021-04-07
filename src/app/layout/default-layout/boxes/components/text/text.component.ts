import { Component } from '@angular/core';

import { FieldRendetingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeModelComponent } from '../rendering-type.model';

/**
 * This component renders the text metadata fields
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'span[ds-text]',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
@MetadataBoxFieldRendering(FieldRendetingType.TEXT)
export class TextComponent extends RenderingTypeModelComponent {

}
