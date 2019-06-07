import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { Component } from '@angular/core';
import { focusShadow } from '../../../../shared/animations/focus';
import { TypedItemSearchResultGridElementComponent } from '../../../../shared/object-grid/item-grid-element/item-types/typed-item-search-result-grid-element.component';

@rendersItemType('JournalIssue', ItemViewMode.Card)
@Component({
  selector: 'ds-journal-issue-grid-element',
  styleUrls: ['./journal-issue-grid-element.component.scss'],
  templateUrl: './journal-issue-grid-element.component.html',
  animations: [focusShadow]
})
export class JournalIssueGridElementComponent extends TypedItemSearchResultGridElementComponent {
}
