import {
  Component,
  OnInit,
} from '@angular/core';

import { TruncatableComponent } from '../../../../../../../shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../../../../../shared/truncatable/truncatable-part/truncatable-part.component';
import { FieldRenderingType } from '../field-rendering-type';
import { HtmlComponent } from '../html/html.component';
import { MetadataBoxFieldRendering } from '../metadata-box.decorator';

/**
 * This component renders the text metadata fields with a show more button
 */
@MetadataBoxFieldRendering(FieldRenderingType.LONGHTML)
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'span[ds-longhtml]',
  templateUrl: './longhtml.component.html',
  styleUrls: ['./longhtml.component.scss'],
  imports: [
    TruncatableComponent,
    TruncatablePartComponent,
  ],
})
export class LonghtmlComponent extends HtmlComponent implements OnInit {

  /**
   * Id for truncatable component
   */
  truncatableId: string;

  ngOnInit(): void {
    this.truncatableId = `${this.item.id}_${this.field.metadata}_html`;
  }


}
