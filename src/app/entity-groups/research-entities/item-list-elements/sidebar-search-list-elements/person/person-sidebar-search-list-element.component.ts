import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import { Component } from '@angular/core';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { LinkService } from '@dspace/core/cache/builders/link.service';
import { Context } from '@dspace/core/shared/context.model';
import { Item } from '@dspace/core/shared/item.model';
import { ItemSearchResult } from '@dspace/core/shared/object-collection/item-search-result.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import { isNotEmpty } from '@dspace/shared/utils/empty.util';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { SidebarSearchListElementComponent } from '../../../../../shared/object-list/sidebar-search-list-element/sidebar-search-list-element.component';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { TruncatablePartComponent } from '../../../../../shared/truncatable/truncatable-part/truncatable-part.component';

@listableObjectComponent('PersonSearchResult', ViewMode.ListElement, Context.SideBarSearchModal)
@listableObjectComponent('PersonSearchResult', ViewMode.ListElement, Context.SideBarSearchModalCurrent)
@listableObjectComponent('PersonSearchResult', ViewMode.ListElement, Context.ScopeSelectorModal)
@listableObjectComponent('PersonSearchResult', ViewMode.ListElement, Context.ScopeSelectorModalCurrent)
@Component({
  selector: 'ds-person-sidebar-search-list-element',
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
 * Component displaying a list element for a {@link ItemSearchResult} of type "Person" within the context of
 * a sidebar search modal
 */
export class PersonSidebarSearchListElementComponent extends SidebarSearchListElementComponent<ItemSearchResult, Item> {
  constructor(protected truncatableService: TruncatableService,
              protected linkService: LinkService,
              protected translateService: TranslateService,
              public dsoNameService: DSONameService,
  ) {
    super(truncatableService, linkService, dsoNameService);
  }

  /**
   * Get the description of the Person by returning its job title(s)
   */
  getDescription(): string {
    const titles = this.allMetadataValues(['person.jobTitle']);
    let description = '';
    if (isNotEmpty(titles)) {
      description += titles.join(', ');
    }
    return this.undefinedIfEmpty(description);
  }
}
