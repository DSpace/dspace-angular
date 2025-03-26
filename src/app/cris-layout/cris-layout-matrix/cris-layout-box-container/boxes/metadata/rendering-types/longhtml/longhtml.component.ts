import { Component, OnInit } from '@angular/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeValueModelComponent } from '../rendering-type-value.model';

/**
 * This component renders the text metadata fields with a show more button
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'span[ds-longhtml]',
  templateUrl: './longhtml.component.html',
  styleUrls: ['./longhtml.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.LONGHTML)
export class LonghtmlComponent extends RenderingTypeValueModelComponent implements OnInit {

  /**
   * Id for truncatable component
   */
  truncatableId: string;

  ngOnInit(): void {
    this.truncatableId = `${this.item.id}_${this.field.metadata}_html`;
  }

  /**
   * If the metadata value does not contain HTML tags then replace newline character with <br>
   * @param text
   */
  processHtml(text: string): string {
    const htmlTagRegex = /<.*?>/;
    return htmlTagRegex.test(text) ? text.replace(/\n/, '<br>') : text;
  }

}
