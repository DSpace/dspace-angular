import { Component } from '@angular/core';
import { rendersEntityType } from '../../../../entities/entity-type-decorator';
import { ElementViewMode } from '../../../../view-mode';
import { EntitySearchResultComponent } from '../entity-search-result-component';

@rendersEntityType('Journal', ElementViewMode.SetElement)
@Component({
  selector: 'ds-journal-list-element',
  styleUrls: ['./journal-list-element.component.scss'],
  templateUrl: './journal-list-element.component.html'
})
/**
 * The component for displaying a list element for an item with entity type Journal
 */
export class JournalListElementComponent extends EntitySearchResultComponent {
}
