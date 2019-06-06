import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { Component } from '@angular/core';
import { TypedItemSearchResultGridElementComponent } from '../../../../shared/object-grid/item-grid-element/item-types/typed-item-search-result-grid-element.component';
import { focusShadow } from '../../../../shared/animations/focus';

@rendersItemType('Person', ItemViewMode.Card)
@Component({
  selector: 'ds-person-grid-element',
  styleUrls: ['./person-grid-element.component.scss'],
  templateUrl: './person-grid-element.component.html',
  animations: [focusShadow]
})
export class PersonGridElementComponent extends TypedItemSearchResultGridElementComponent {
}
