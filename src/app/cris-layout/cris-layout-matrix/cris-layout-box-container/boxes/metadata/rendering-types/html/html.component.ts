import { Component } from '@angular/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeValueModelComponent } from '../rendering-type-value.model';

/**
 * This component renders the text metadata fields
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'span[ds-html]',
  templateUrl: './html.component.html',
  styleUrls: ['./html.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.HTML)
export class HtmlComponent extends RenderingTypeValueModelComponent {

  /**
   * If the metadata value does not contain HTML tags then replace newline character with <br>
   * @param text
   */
  processHtml(text: string): string {
    const htmlTagRegex = /<.*?>/;
    return htmlTagRegex.test(text) ? text.replace(/\n/, '<br>') : text;
  }

}
