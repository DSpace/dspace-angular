import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { FieldRenderingType } from '../field-rendering-type';
import { metadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeValueDirective } from '../rendering-type-value.directive';

/**
 * This component renders the text metadata fields
 */
@metadataBoxFieldRendering(FieldRenderingType.HTML)
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'span[ds-html]',
  templateUrl: './html.component.html',
  styleUrls: ['./html.component.scss'],
})
export class HtmlComponent extends RenderingTypeValueDirective implements OnInit, OnChanges {

  /**
   * The processed HTML value to render
   */
  processedHtml: string;

  ngOnInit(): void {
    this.processedHtml = this.processHtml(this.metadataValue?.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.metadataValue) {
      this.processedHtml = this.processHtml(this.metadataValue?.value);
    }
  }

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
