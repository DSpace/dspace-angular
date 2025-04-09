import { Component } from '@angular/core';

import { TruncatableComponent } from '../../../../../../../shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../../../../../shared/truncatable/truncatable-part/truncatable-part.component';
import { RenderingTypeValueModelComponent } from '../rendering-type-value.model';

/**
 * This component renders the longtext metadata fields
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'div[ds-longtext]',
  templateUrl: './longtext.component.html',
  styleUrls: ['./longtext.component.scss'],
  standalone: true,
  imports: [TruncatableComponent, TruncatablePartComponent],
})
export class LongtextComponent extends RenderingTypeValueModelComponent {

  /**
   * Id for truncable component
   */
  truncableId = `${this.item.id}_${this.field.metadata}`;

}
