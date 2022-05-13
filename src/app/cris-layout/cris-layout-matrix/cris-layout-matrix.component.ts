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

  /**
   * A boolean representing if to use an internal padding for the cells
   */
  @Input() showCellPadding = true;

  /**
   * Check if style contains 'col' or 'col-x'
   * @param style the style of the cell (a list of classes separated by space)
   */
  hasColClass(style) {
    return style?.split(' ').filter((c) => (c === 'col' || c.startsWith('col-'))).length > 0;
  }

  /**
   * Check if style contains 'row'
   * @param style the style of the row (a list of classes separated by space)
   */
  hasRowClass(style) {
    return style?.split(' ').filter((r) => (r === 'row')).length > 0;
  }

}
