
import {
  Component,
  Input,
} from '@angular/core';

import {
  DynamicLayoutBox,
  LayoutField,
  MetadataBoxCell,
  MetadataBoxRow,
} from '../../../../../../core/layout/models/box.model';
import { Item } from '../../../../../../core/shared/item.model';
import { MetadataContainerComponent } from './metadata-container/metadata-container.component';

/**
 * This component renders the rows of metadata boxes
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[ds-row]',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss'],
  imports: [
    MetadataContainerComponent,
  ],
})
export class RowComponent {

  /**
   * Current DSpace Item
   */
  @Input() item: Item;
  /**
   * Current layout box
   */
  @Input() box: DynamicLayoutBox;
  /**
   * Current row configuration
   */
  @Input() row: MetadataBoxRow;

  trackUpdate(index, field: LayoutField) {
    return field && field.metadata;
  }

  trackCellUpdate(index, cell: MetadataBoxCell) {
    return cell && cell.fields;
  }

}
