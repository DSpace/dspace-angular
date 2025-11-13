import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import { Component } from '@angular/core';
import { Collection } from '@dspace/core/shared/collection.model';
import { Context } from '@dspace/core/shared/context.model';
import { CollectionSearchResult } from '@dspace/core/shared/object-collection/collection-search-result.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import { TranslateModule } from '@ngx-translate/core';

import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { TruncatablePartComponent } from '../../../truncatable/truncatable-part/truncatable-part.component';
import { SidebarSearchListElementComponent } from '../sidebar-search-list-element.component';

@listableObjectComponent(CollectionSearchResult, ViewMode.ListElement, Context.SideBarSearchModal)
@listableObjectComponent(CollectionSearchResult, ViewMode.ListElement, Context.SideBarSearchModalCurrent)
@listableObjectComponent(CollectionSearchResult, ViewMode.ListElement, Context.ScopeSelectorModal)
@listableObjectComponent(CollectionSearchResult, ViewMode.ListElement, Context.ScopeSelectorModalCurrent)
@Component({
  selector: 'ds-collection-sidebar-search-list-element',
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
 * Component displaying a list element for a {@link CollectionSearchResult} within the context of a sidebar search modal
 */
export class CollectionSidebarSearchListElementComponent extends SidebarSearchListElementComponent<CollectionSearchResult, Collection> {
  /**
   * Get the description of the Collection by returning its abstract
   */
  getDescription(): string {
    return this.firstMetadataValue('dc.description.abstract');
  }
}
