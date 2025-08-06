import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import { Component } from '@angular/core';
import { Context } from '@dspace/core/shared/context.model';
import { Item } from '@dspace/core/shared/item.model';
import { ItemSearchResult } from '@dspace/core/shared/object-collection/item-search-result.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import { isNotEmpty } from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';

import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { SidebarSearchListElementComponent } from '../../../../../shared/object-list/sidebar-search-list-element/sidebar-search-list-element.component';
import { TruncatablePartComponent } from '../../../../../shared/truncatable/truncatable-part/truncatable-part.component';

@listableObjectComponent('JournalIssueSearchResult', ViewMode.ListElement, Context.SideBarSearchModal)
@listableObjectComponent('JournalIssueSearchResult', ViewMode.ListElement, Context.SideBarSearchModalCurrent)
@listableObjectComponent('JournalIssueSearchResult', ViewMode.ListElement, Context.ScopeSelectorModal)
@listableObjectComponent('JournalIssueSearchResult', ViewMode.ListElement, Context.ScopeSelectorModalCurrent)
@Component({
  selector: 'ds-journal-issue-sidebar-search-list-element',
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
 * Component displaying a list element for a {@link ItemSearchResult} of type "JournalIssue" within the context of
 * a sidebar search modal
 */
export class JournalIssueSidebarSearchListElementComponent extends SidebarSearchListElementComponent<ItemSearchResult, Item> {
  /**
   * Get the description of the Journal Issue by returning its volume number(s) and/or issue number(s)
   */
  getDescription(): string {
    const volumeNumbers = this.allMetadataValues(['publicationvolume.volumeNumber']);
    const issueNumbers = this.allMetadataValues(['publicationissue.issueNumber']);
    let description = '';
    if (isNotEmpty(volumeNumbers)) {
      description += volumeNumbers.join(', ');
    }
    if (isNotEmpty(description) && isNotEmpty(issueNumbers)) {
      description += ' - ';
    }
    if (isNotEmpty(issueNumbers)) {
      description += issueNumbers.join(', ');
    }
    return this.undefinedIfEmpty(description);
  }
}
