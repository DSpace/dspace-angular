import { Component } from '@angular/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeValueModelComponent } from '../rendering-type-value.model';

/**
 * This component renders the longtext metadata fields
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'div[ds-longtext]',
  templateUrl: './longtext.component.html',
  styleUrls: ['./longtext.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.LONGTEXT)
export class LongtextComponent extends RenderingTypeValueModelComponent {

  /**
   * Id for truncable component
   */
  truncableId: string;

  ngOnInit(): void {
    this.truncableId = `${this.item.id}_${this.field.metadata}`;
  }
}
