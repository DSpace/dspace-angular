import { Component } from '@angular/core';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../core/shared/context.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { SidebarSearchListElementComponent } from '../sidebar-search-list-element.component';
import { CommunitySearchResult } from '../../../object-collection/shared/community-search-result.model';
import { Community } from '../../../../core/shared/community.model';
import { TranslateModule } from '@ngx-translate/core';
import { NgClass, NgIf, AsyncPipe } from '@angular/common';
import { TruncatablePartComponent } from '../../../truncatable/truncatable-part/truncatable-part.component';

@listableObjectComponent(CommunitySearchResult, ViewMode.ListElement, Context.SideBarSearchModal)
@listableObjectComponent(CommunitySearchResult, ViewMode.ListElement, Context.SideBarSearchModalCurrent)
@Component({
    selector: 'ds-collection-sidebar-search-list-element',
    templateUrl: '../sidebar-search-list-element.component.html',
    standalone: true,
    imports: [TruncatablePartComponent, NgClass, NgIf, AsyncPipe, TranslateModule]
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
