import { Component } from '@angular/core';
import { Item } from '@dspace/core/shared/item.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';

import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { AbstractListableElementComponent } from '../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';
import { JournalSearchResultListElementComponent } from '../search-result-list-elements/journal/journal-search-result-list-element.component';

@listableObjectComponent('Journal', ViewMode.ListElement)
@Component({
  selector: 'ds-journal-list-element',
  styleUrls: ['./journal-list-element.component.scss'],
  templateUrl: './journal-list-element.component.html',
  standalone: true,
  imports: [
    JournalSearchResultListElementComponent,
  ],
})
/**
 * The component for displaying a list element for an item of the type Journal
 */
export class JournalListElementComponent extends AbstractListableElementComponent<Item> {
}
