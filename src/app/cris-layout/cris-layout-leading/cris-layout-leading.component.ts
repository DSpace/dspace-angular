import { Component, Input } from '@angular/core';

import { CrisLayoutTab } from '../../core/layout/models/tab.model';
import { Item } from '../../core/shared/item.model';

@Component({
  selector: 'ds-cris-layout-leading',
  templateUrl: './cris-layout-leading.component.html',
  styleUrls: ['./cris-layout-leading.component.scss']
})
export class CrisLayoutLeadingComponent {

  /**
   * Tabs to render
   */
  @Input() tab: CrisLayoutTab;

  /**
   * The related item
   */
  @Input() item: Item;

  /**
   * A boolean representing if to show context menu or not
   */
  @Input() showContextMenu: boolean;
}
