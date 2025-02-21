import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ItemSearchResult } from '@dspace/core';
import { Context } from '@dspace/core';
import { Item } from '@dspace/core';
import { ViewMode } from '@dspace/core';
import { listableObjectComponent } from '../../../../object-collection/shared/listable-object/listable-object.decorator';
import { TruncatablePartComponent } from '../../../../truncatable/truncatable-part/truncatable-part.component';
import { SidebarSearchListElementComponent } from '../../sidebar-search-list-element.component';

@listableObjectComponent('PublicationSearchResult', ViewMode.ListElement, Context.SideBarSearchModal)
@listableObjectComponent('PublicationSearchResult', ViewMode.ListElement, Context.SideBarSearchModalCurrent)
@listableObjectComponent(ItemSearchResult, ViewMode.ListElement, Context.SideBarSearchModal)
@listableObjectComponent(ItemSearchResult, ViewMode.ListElement, Context.SideBarSearchModalCurrent)
@Component({
  selector: 'ds-publication-sidebar-search-list-element',
  templateUrl: '../../sidebar-search-list-element.component.html',
  standalone: true,
  imports: [TruncatablePartComponent, NgClass, AsyncPipe, TranslateModule],
})
/**
 * Component displaying a list element for a {@link ItemSearchResult} of type "Publication" within the context of
 * a sidebar search modal
 */
export class PublicationSidebarSearchListElementComponent extends SidebarSearchListElementComponent<ItemSearchResult, Item> {

}
