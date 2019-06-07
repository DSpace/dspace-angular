import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { Component } from '@angular/core';
import { focusShadow } from '../../../../shared/animations/focus';
import { TypedItemSearchResultGridElementComponent } from '../../../../shared/object-grid/item-grid-element/item-types/typed-item-search-result-grid-element.component';

@rendersItemType('Journal', ItemViewMode.Card)
@Component({
  selector: 'ds-journal-grid-element',
  styleUrls: ['./journal-grid-element.component.scss'],
  templateUrl: './journal-grid-element.component.html',
  animations: [focusShadow]
})
export class JournalGridElementComponent extends TypedItemSearchResultGridElementComponent {
}
