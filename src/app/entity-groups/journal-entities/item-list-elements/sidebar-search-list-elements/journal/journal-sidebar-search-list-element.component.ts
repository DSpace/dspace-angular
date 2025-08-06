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

@listableObjectComponent('JournalSearchResult', ViewMode.ListElement, Context.SideBarSearchModal)
@listableObjectComponent('JournalSearchResult', ViewMode.ListElement, Context.SideBarSearchModalCurrent)
@listableObjectComponent('JournalSearchResult', ViewMode.ListElement, Context.ScopeSelectorModal)
@listableObjectComponent('JournalSearchResult', ViewMode.ListElement, Context.ScopeSelectorModalCurrent)
@Component({
  selector: 'ds-journal-sidebar-search-list-element',
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
 * Component displaying a list element for a {@link ItemSearchResult} of type "Journal" within the context of
 * a sidebar search modal
 */
export class JournalSidebarSearchListElementComponent extends SidebarSearchListElementComponent<ItemSearchResult, Item> {
  /**
   * Get the description of the Journal by returning its ISSN(s)
   */
  getDescription(): string {
    const issns = this.allMetadataValues(['creativeworkseries.issn']);
    let description = '';
    if (isNotEmpty(issns)) {
      description += issns.join(', ');
    }
    return this.undefinedIfEmpty(description);
  }
}
