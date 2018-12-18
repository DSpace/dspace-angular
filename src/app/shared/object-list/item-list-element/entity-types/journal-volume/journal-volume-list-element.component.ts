import { Component } from '@angular/core';
import { rendersEntityType } from '../../../../entities/entity-type-decorator';
import { ElementViewMode } from '../../../../view-mode';
import { EntitySearchResultComponent } from '../entity-search-result-component';

@rendersEntityType('JournalVolume', ElementViewMode.SetElement)
@Component({
  selector: 'ds-journal-volume-list-element',
  styleUrls: ['./journal-volume-list-element.component.scss'],
  templateUrl: './journal-volume-list-element.component.html'
})
/**
 * The component for displaying a list element for an item with entity type Journal Volume
 */
export class JournalVolumeListElementComponent extends EntitySearchResultComponent {
}
