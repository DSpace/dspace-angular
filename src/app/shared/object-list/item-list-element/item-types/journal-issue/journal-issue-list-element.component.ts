import { Component } from '@angular/core';
import { ItemViewMode, rendersItemType } from '../../../../items/item-type-decorator';
import { TypedItemSearchResultListElementComponent } from '../typed-item-search-result-list-element.component';

@rendersItemType('JournalIssue', ItemViewMode.Element)
@Component({
  selector: 'ds-journal-issue-list-element',
  styleUrls: ['./journal-issue-list-element.component.scss'],
  templateUrl: './journal-issue-list-element.component.html'
})
/**
 * The component for displaying a list element for an item of the type Journal Issue
 */
export class JournalIssueListElementComponent extends TypedItemSearchResultListElementComponent {
}
