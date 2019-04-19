import { Component, Input } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { ItemViewMode } from '../../../shared/items/item-type-decorator';

@Component({
  selector: 'ds-related-items',
  styleUrls: ['./related-items.component.scss'],
  templateUrl: './related-items.component.html'
})
/**
 * This component is used for displaying relations between items
 * It expects a list of items to display and a label to put on top
 */
export class RelatedItemsComponent {
  /**
   * A list of items to display
   */
  @Input() items: Item[];

  /**
   * An i18n label to use as a title for the list (usually describes the relation)
   */
  @Input() label: string;

  /**
   * The view-mode we're currently on
   * @type {ElementViewMode}
   */
  viewMode = ItemViewMode.Element;
}
