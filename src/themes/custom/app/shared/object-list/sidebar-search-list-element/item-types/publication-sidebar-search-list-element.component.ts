import { listableObjectComponent } from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../../../app/core/shared/view-mode.model';
import { Component } from '@angular/core';
import { Context } from '../../../../../../../app/core/shared/context.model';
import { ItemSearchResult } from '../../../../../../../app/shared/object-collection/shared/item-search-result.model';
import {
  PublicationSidebarSearchListElementComponent as BaseComponent
} from '../../../../../../../app/shared/object-list/sidebar-search-list-element/item-types/publication/publication-sidebar-search-list-element.component';

@listableObjectComponent('PublicationSearchResult', ViewMode.ListElement, Context.SideBarSearchModal, 'custom')
@listableObjectComponent('PublicationSearchResult', ViewMode.ListElement, Context.SideBarSearchModalCurrent, 'custom')
@listableObjectComponent(ItemSearchResult, ViewMode.ListElement, Context.SideBarSearchModal, 'custom')
@listableObjectComponent(ItemSearchResult, ViewMode.ListElement, Context.SideBarSearchModalCurrent, 'custom')
@Component({
  selector: 'ds-publication-sidebar-search-list-element',
  // templateUrl: './publication-sidebar-search-list-element.component.html',
  templateUrl: '../../../../../../../app/shared/object-list/sidebar-search-list-element/sidebar-search-list-element.component.html',
})
export class PublicationSidebarSearchListElementComponent extends BaseComponent {
}
