import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import { Component } from '@angular/core';
import { Community } from '@dspace/core/shared/community.model';
import { Context } from '@dspace/core/shared/context.model';
import { CommunitySearchResult } from '@dspace/core/shared/object-collection/community-search-result.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import { TranslateModule } from '@ngx-translate/core';

import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { TruncatablePartComponent } from '../../../truncatable/truncatable-part/truncatable-part.component';
import { SidebarSearchListElementComponent } from '../sidebar-search-list-element.component';

@listableObjectComponent(CommunitySearchResult, ViewMode.ListElement, Context.SideBarSearchModal)
@listableObjectComponent(CommunitySearchResult, ViewMode.ListElement, Context.SideBarSearchModalCurrent)
@listableObjectComponent(CommunitySearchResult, ViewMode.ListElement, Context.ScopeSelectorModal)
@listableObjectComponent(CommunitySearchResult, ViewMode.ListElement, Context.ScopeSelectorModalCurrent)
@Component({
  selector: 'ds-community-sidebar-search-list-element',
  templateUrl: '../sidebar-search-list-element.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    TranslateModule,
    TruncatablePartComponent,
  ],
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
