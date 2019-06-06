import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { Component } from '@angular/core';
import { focusShadow } from '../../../../shared/animations/focus';
import { TypedItemSearchResultGridElementComponent } from '../../../../shared/object-grid/item-grid-element/item-types/typed-item-search-result-grid-element.component';

@rendersItemType('OrgUnit', ItemViewMode.Card)
@Component({
  selector: 'ds-orgunit-grid-element',
  styleUrls: ['./orgunit-grid-element.component.scss'],
  templateUrl: './orgunit-grid-element.component.html',
  animations: [focusShadow]
})
export class OrgunitGridElementComponent extends TypedItemSearchResultGridElementComponent {
}
