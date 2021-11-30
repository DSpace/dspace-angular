import { Component, Input } from '@angular/core';

import { CrisLayoutTab } from '../../core/layout/models/tab.model';
import { Item } from '../../core/shared/item.model';

@Component({
  selector: 'ds-cris-layout-matrix',
  templateUrl: './cris-layout-matrix.component.html',
  styleUrls: ['./cris-layout-matrix.component.scss']
})
export class CrisLayoutMatrixComponent {

  /**
   * Tabs to render
   */
  @Input() tab: CrisLayoutTab;

  /**
   * Tabs to render
   */
  @Input() row;

  /**
   * Item that is being viewed
   */
  @Input() item: Item;

}
