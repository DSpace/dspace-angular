import { Component } from '@angular/core';
import { rendersItemType } from '../../../../shared/items/item-type-decorator';
import { TypedItemSearchResultListElementComponent } from '../../../../shared/object-list/item-list-element/item-types/typed-item-search-result-list-element.component';
import { ViewMode } from '../../../../core/shared/view-mode.model';

@rendersItemType('Journal', ViewMode.ListElement)
@Component({
  selector: 'ds-journal-list-element',
  styleUrls: ['./journal-list-element.component.scss'],
  templateUrl: './journal-list-element.component.html'
})
/**
 * The component for displaying a list element for an item of the type Journal
 */
export class JournalListElementComponent extends TypedItemSearchResultListElementComponent {
}
