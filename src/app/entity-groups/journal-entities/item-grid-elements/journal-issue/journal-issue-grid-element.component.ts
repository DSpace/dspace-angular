import { Component } from '@angular/core';

import { Item } from '../../../../core/shared/item.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { AbstractListableElementComponent } from '../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';
import { JournalIssueSearchResultGridElementComponent } from '../search-result-grid-elements/journal-issue/journal-issue-search-result-grid-element.component';

@listableObjectComponent('JournalIssue', ViewMode.GridElement)
@Component({
  selector: 'ds-journal-issue-grid-element',
  styleUrls: ['./journal-issue-grid-element.component.scss'],
  templateUrl: './journal-issue-grid-element.component.html',
  standalone: true,
  imports: [
    JournalIssueSearchResultGridElementComponent,
  ],
})
/**
 * The component for displaying a grid element for an item of the type Journal Issue
 */
export class JournalIssueGridElementComponent extends AbstractListableElementComponent<Item> {
}
