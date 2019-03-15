import { Component } from '@angular/core';
import { rendersItemType } from '../../../../items/item-type-decorator';
import { TypedItemSearchResultListElementComponent } from '../typed-item-search-result-list-element.component';
import { VIEW_MODE_ELEMENT } from '../../../../../+item-page/simple/related-items/related-items-component';

@rendersItemType('JournalVolume', VIEW_MODE_ELEMENT)
@Component({
  selector: 'ds-journal-volume-list-element',
  styleUrls: ['./journal-volume-list-element.component.scss'],
  templateUrl: './journal-volume-list-element.component.html'
})
/**
 * The component for displaying a list element for an item of the type Journal Volume
 */
export class JournalVolumeListElementComponent extends TypedItemSearchResultListElementComponent {
}
