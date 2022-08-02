import { listableObjectComponent } from '../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { Context } from '../../../core/shared/context.model';
import { ItemSearchResult } from '../../../shared/object-collection/shared/item-search-result.model';
import { Component } from '@angular/core';
import { SidebarSearchListElementComponent } from '../../../shared/object-list/sidebar-search-list-element/sidebar-search-list-element.component';
import { Item } from '../../../core/shared/item.model';
import { isNotEmpty } from '../../../shared/empty.util';

@listableObjectComponent('ResourceTypeSearchResult', ViewMode.ListElement, Context.SideBarSearchModal)
@listableObjectComponent('ResourceTypeSearchResult', ViewMode.ListElement, Context.SideBarSearchModalCurrent)
@Component({
  selector: 'ds-resource-type-sidebar-search-list-element',
  templateUrl: '../../../shared/object-list/sidebar-search-list-element/sidebar-search-list-element.component.html'
})
/**
 * Component displaying a list element for a {@link ItemSearchResult} of type "ResourceType" within the context of
 * a sidebar search modal
 */
export class ResourceTypeSidebarSearchListElementComponent extends SidebarSearchListElementComponent<ItemSearchResult, Item> {
}
