import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { Component } from '@angular/core';
import { focusShadow } from '../../../../shared/animations/focus';
import { TypedItemSearchResultGridElementComponent } from '../../../../shared/object-grid/item-grid-element/item-types/typed-item-search-result-grid-element.component';

@rendersItemType('JournalVolume', ItemViewMode.Card)
@Component({
  selector: 'ds-journal-volume-grid-element',
  styleUrls: ['./journal-volume-grid-element.component.scss'],
  templateUrl: './journal-volume-grid-element.component.html',
  animations: [focusShadow]
})
export class JournalVolumeGridElementComponent extends TypedItemSearchResultGridElementComponent {
}
