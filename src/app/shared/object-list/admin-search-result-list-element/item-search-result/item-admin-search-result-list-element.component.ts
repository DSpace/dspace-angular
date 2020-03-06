import { Component } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../core/shared/context.model';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';
import { SearchResultListElementComponent } from '../../search-result-list-element/search-result-list-element.component';
import { getItemEditPath } from '../../../../+item-page/item-page-routing.module';
import { URLCombiner } from '../../../../core/url-combiner/url-combiner';
import {
  ITEM_EDIT_DELETE_PATH,
  ITEM_EDIT_MOVE_PATH,
  ITEM_EDIT_PRIVATE_PATH, ITEM_EDIT_PUBLIC_PATH,
  ITEM_EDIT_REINSTATE_PATH,
  ITEM_EDIT_WITHDRAW_PATH
} from '../../../../+item-page/edit-item-page/edit-item-page.routing.module';

@listableObjectComponent(ItemSearchResult, ViewMode.ListElement, Context.AdminSearch)
@Component({
  selector: 'ds-item-admin-search-result-list-element',
  styleUrls: ['./item-admin-search-result-list-element.component.scss'],
  templateUrl: './item-admin-search-result-list-element.component.html'
})
/**
 * The component for displaying a list element for an item search result on the admin search page
 */
export class ItemAdminSearchResultListElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> {

  /**
   * Returns the path to the edit page of this item
   */
  getEditPath(): string {
    return getItemEditPath(this.dso.uuid)
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
