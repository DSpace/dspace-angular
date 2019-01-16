import { Component } from '@angular/core';
import { rendersItemType } from '../../../../items/item-type-decorator';
import { ElementViewMode } from '../../../../view-mode';
import { ItemSearchResultComponent } from '../item-search-result-component';

@rendersItemType('JournalVolume', ElementViewMode.SetElement)
@Component({
  selector: 'ds-journal-volume-list-element',
  styleUrls: ['./journal-volume-list-element.component.scss'],
  templateUrl: './journal-volume-list-element.component.html'
})
/**
 * The component for displaying a list element for an item of the type Journal Volume
 */
export class JournalVolumeListElementComponent extends ItemSearchResultComponent {
}
