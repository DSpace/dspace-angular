import { Component } from '@angular/core';
import { rendersItemType } from '../../../../items/item-type-decorator';
import { ElementViewMode } from '../../../../view-mode';
import { ItemSearchResultComponent } from '../item-search-result-component';

@rendersItemType('Journal', ElementViewMode.SetElement)
@Component({
  selector: 'ds-journal-list-element',
  styleUrls: ['./journal-list-element.component.scss'],
  templateUrl: './journal-list-element.component.html'
})
/**
 * The component for displaying a list element for an item of the type Journal
 */
export class JournalListElementComponent extends ItemSearchResultComponent {
}
