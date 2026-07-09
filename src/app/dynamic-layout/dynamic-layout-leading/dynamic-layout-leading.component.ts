
import {
  Component,
  Input,
} from '@angular/core';

import { DynamicLayoutTab } from '../../core/layout/models/tab.model';
import { Item } from '../../core/shared/item.model';
import { DynamicLayoutMatrixComponent } from '../dynamic-layout-matrix/dynamic-layout-matrix.component';

@Component({
  selector: 'ds-dynamic-layout-leading',
  templateUrl: './dynamic-layout-leading.component.html',
  styleUrls: ['./dynamic-layout-leading.component.scss'],
  imports: [
    DynamicLayoutMatrixComponent,
  ],
})
export class DynamicLayoutLeadingComponent {

  /**
   * Tabs to render
   */
  @Input() tab: DynamicLayoutTab;

  /**
   * The related item
   */
  @Input() item: Item;

  /**
   * A boolean representing if to show context menu or not
   */
  @Input() showContextMenu: boolean;
}
