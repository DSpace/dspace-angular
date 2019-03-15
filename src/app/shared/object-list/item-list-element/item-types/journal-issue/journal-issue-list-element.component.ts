import { Component } from '@angular/core';
import { rendersItemType } from '../../../../items/item-type-decorator';
import { TypedItemSearchResultListElementComponent } from '../typed-item-search-result-list-element.component';
import { VIEW_MODE_ELEMENT } from '../../../../../+item-page/simple/related-items/related-items-component';

@rendersItemType('JournalIssue', VIEW_MODE_ELEMENT)
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
