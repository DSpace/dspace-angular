import { Component } from '@angular/core';

import { Item } from '../../../../core/shared/item.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { AbstractListableElementComponent } from '../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';
import { JournalIssueSearchResultListElementComponent } from '../search-result-list-elements/journal-issue/journal-issue-search-result-list-element.component';

@listableObjectComponent('JournalIssue', ViewMode.ListElement)
@Component({
  selector: 'ds-journal-issue-list-element',
  styleUrls: ['./journal-issue-list-element.component.scss'],
  templateUrl: './journal-issue-list-element.component.html',
  standalone: true,
  imports: [
    JournalIssueSearchResultListElementComponent,
  ],
})
/**
 * The component for displaying a list element for an item of the type Journal Issue
 */
export class JournalIssueListElementComponent extends AbstractListableElementComponent<Item> {
}
