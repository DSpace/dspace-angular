import { Component } from '@angular/core';

import { FieldRenderingType } from '../field-rendering-type';
import { MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeValueDirective } from '../rendering-type-value.directive';

/**
 * This component renders the text metadata fields
 */
@MetadataBoxFieldRendering(FieldRenderingType.HTML)
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'span[ds-html]',
  templateUrl: './html.component.html',
  styleUrls: ['./html.component.scss'],
})
export class HtmlComponent extends RenderingTypeValueDirective {

  /**
   * If the metadata value does not contain HTML tags then replace newline character with <br>
   * @param text
   */
  processHtml(text: string): string {
    const htmlTagRegex = /<.*?>/;
    return htmlTagRegex.test(text)
      ? text.replace(/\n/g, '<br>')
      : text;
  }

}
