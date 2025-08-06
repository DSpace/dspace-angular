import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import { Component } from '@angular/core';
import { Context } from '@dspace/core/shared/context.model';
import { Item } from '@dspace/core/shared/item.model';
import { ItemSearchResult } from '@dspace/core/shared/object-collection/item-search-result.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import { TranslateModule } from '@ngx-translate/core';

import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { SidebarSearchListElementComponent } from '../../../../../shared/object-list/sidebar-search-list-element/sidebar-search-list-element.component';
import { TruncatablePartComponent } from '../../../../../shared/truncatable/truncatable-part/truncatable-part.component';

@listableObjectComponent('OrgUnitSearchResult', ViewMode.ListElement, Context.SideBarSearchModal)
@listableObjectComponent('OrgUnitSearchResult', ViewMode.ListElement, Context.SideBarSearchModalCurrent)
@listableObjectComponent('OrgUnitSearchResult', ViewMode.ListElement, Context.ScopeSelectorModal)
@listableObjectComponent('OrgUnitSearchResult', ViewMode.ListElement, Context.ScopeSelectorModalCurrent)
@Component({
  selector: 'ds-org-unit-sidebar-search-list-element',
  templateUrl: '../../../../../shared/object-list/sidebar-search-list-element/sidebar-search-list-element.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    TranslateModule,
    TruncatablePartComponent,
  ],
})
/**
 * Component displaying a list element for a {@link ItemSearchResult} of type "OrgUnit" within the context of
 * a sidebar search modal
 */
export class OrgUnitSidebarSearchListElementComponent extends SidebarSearchListElementComponent<ItemSearchResult, Item> {

  /**
   * Get the description of the Org Unit by returning its dc.description
   */
  getDescription(): string {
    return this.firstMetadataValue('dc.description');
  }
}
