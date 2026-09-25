
import {
  Component,
  Input,
} from '@angular/core';

import { DynamicLayoutTab } from '../../core/layout/models/tab.model';
import { Item } from '../../core/shared/item.model';
import { DynamicLayoutBoxContainerComponent } from './dynamic-layout-box-container/dynamic-layout-box-container.component';

/**
 * Component responsible for rendering the rows and cells of a tab's layout matrix.
 * Each cell contains one or more boxes rendered via {@link DynamicLayoutBoxContainerComponent}.
 * Applies Bootstrap grid classes based on configured styles.
 */
@Component({
  selector: 'ds-dynamic-layout-matrix',
  templateUrl: './dynamic-layout-matrix.component.html',
  styleUrls: ['./dynamic-layout-matrix.component.scss'],
  imports: [
    DynamicLayoutBoxContainerComponent,
  ],
})
export class DynamicLayoutMatrixComponent {

  /**
   * Tabs to render
   */
  @Input() tab: DynamicLayoutTab;

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
