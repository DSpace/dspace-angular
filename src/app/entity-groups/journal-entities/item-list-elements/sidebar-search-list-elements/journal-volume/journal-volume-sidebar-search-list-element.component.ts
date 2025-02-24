import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import { Component } from '@angular/core';
import {
  Context,
  Item,
  ItemSearchResult,
  ViewMode,
} from '@dspace/core';
import { isNotEmpty } from '@dspace/shared/utils';
import { TranslateModule } from '@ngx-translate/core';

import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { SidebarSearchListElementComponent } from '../../../../../shared/object-list/sidebar-search-list-element/sidebar-search-list-element.component';
import { TruncatablePartComponent } from '../../../../../shared/truncatable/truncatable-part/truncatable-part.component';

@listableObjectComponent('JournalVolumeSearchResult', ViewMode.ListElement, Context.SideBarSearchModal)
@listableObjectComponent('JournalVolumeSearchResult', ViewMode.ListElement, Context.SideBarSearchModalCurrent)
@Component({
  selector: 'ds-journal-volume-sidebar-search-list-element',
  templateUrl: '../../../../../shared/object-list/sidebar-search-list-element/sidebar-search-list-element.component.html',
  standalone: true,
  imports: [TruncatablePartComponent, NgClass, AsyncPipe, TranslateModule],
})
/**
 * Component displaying a list element for a {@link ItemSearchResult} of type "JournalVolume" within the context of
 * a sidebar search modal
 */
export class JournalVolumeSidebarSearchListElementComponent extends SidebarSearchListElementComponent<ItemSearchResult, Item> {
  /**
   * Get the description of the Journal Volume by returning the journal title and volume number(s) (between parentheses)
   */
  getDescription(): string {
    const titles = this.allMetadataValues(['journal.title']);
    const numbers = this.allMetadataValues(['publicationvolume.volumeNumber']);
    let description = '';
    if (isNotEmpty(titles)) {
      description += titles.join(', ');
    }
    if (isNotEmpty(numbers)) {
      if (isNotEmpty(description)) {
        description += ' ';
      }
      description += numbers.map((n) => `(${n})`).join(' ');
    }
    return this.undefinedIfEmpty(description);
  }
}
