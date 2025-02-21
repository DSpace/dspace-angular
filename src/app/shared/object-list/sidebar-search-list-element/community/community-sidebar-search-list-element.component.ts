import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CommunitySearchResult } from '@dspace/core';
import { Community } from '@dspace/core';
import { Context } from '@dspace/core';
import { ViewMode } from '@dspace/core';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { TruncatablePartComponent } from '../../../truncatable/truncatable-part/truncatable-part.component';
import { SidebarSearchListElementComponent } from '../sidebar-search-list-element.component';

@listableObjectComponent(CommunitySearchResult, ViewMode.ListElement, Context.SideBarSearchModal)
@listableObjectComponent(CommunitySearchResult, ViewMode.ListElement, Context.SideBarSearchModalCurrent)
@Component({
  selector: 'ds-community-sidebar-search-list-element',
  templateUrl: '../sidebar-search-list-element.component.html',
  standalone: true,
  imports: [TruncatablePartComponent, NgClass, AsyncPipe, TranslateModule],
})
/**
 * Component displaying a list element for a {@link CommunitySearchResult} within the context of a sidebar search modal
 */
export class CommunitySidebarSearchListElementComponent extends SidebarSearchListElementComponent<CommunitySearchResult, Community> {
  /**
   * Get the description of the Community by returning its abstract
   */
  getDescription(): string {
    return this.firstMetadataValue('dc.description.abstract');
  }
}
