import { Component, Input } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { getItemEditPath } from '../../../+item-page/item-page-routing.module';
import { URLCombiner } from '../../../core/url-combiner/url-combiner';
import {
  ITEM_EDIT_DELETE_PATH,
  ITEM_EDIT_MOVE_PATH,
  ITEM_EDIT_PRIVATE_PATH,
  ITEM_EDIT_PUBLIC_PATH,
  ITEM_EDIT_REINSTATE_PATH,
  ITEM_EDIT_WITHDRAW_PATH
} from '../../../+item-page/edit-item-page/edit-item-page.routing.module';

@Component({
  selector: 'ds-item-admin-search-result-actions-element',
  styleUrls: ['./item-admin-search-result-actions.component.scss'],
  templateUrl: './item-admin-search-result-actions.component.html'
})
/**
 * The component for displaying the actions for a list element for an item search result on the admin search page
 */
export class ItemAdminSearchResultActionsComponent {
  /**
   * The item to perform the actions on
   */
  @Input() public item: Item;

  /**
   * Whether or not to use small buttons
   */
  @Input() public small: boolean;

  /**
   * Returns the path to the edit page of this item
   */
  getEditPath(): string {
    return getItemEditPath(this.item.uuid)
  }

  /**
   * Returns the path to the move page of this item
   */
  getMovePath(): string {
    return new URLCombiner(this.getEditPath(), ITEM_EDIT_MOVE_PATH).toString();
  }

  /**
   * Returns the path to the delete page of this item
   */
  getDeletePath(): string {
    return new URLCombiner(this.getEditPath(), ITEM_EDIT_DELETE_PATH).toString();
  }

  /**
   * Returns the path to the withdraw page of this item
   */
  getWithdrawPath(): string {
    return new URLCombiner(this.getEditPath(), ITEM_EDIT_WITHDRAW_PATH).toString();
  }

  /**
   * Returns the path to the reinstate page of this item
   */
  getReinstatePath(): string {
    return new URLCombiner(this.getEditPath(), ITEM_EDIT_REINSTATE_PATH).toString();
  }

  /**
   * Returns the path to the page where the user can make this item private
   */
  getPrivatePath(): string {
    return new URLCombiner(this.getEditPath(), ITEM_EDIT_PRIVATE_PATH).toString();
  }

  /**
   * Returns the path to the page where the user can make this item public
   */
  getPublicPath(): string {
    return new URLCombiner(this.getEditPath(), ITEM_EDIT_PUBLIC_PATH).toString();
  }
}
