import { Component } from '@angular/core';
import { DEFAULT_ENTITY_TYPE, rendersEntityType } from '../../../../entities/entity-type-decorator';
import { ElementViewMode } from '../../../../view-mode';
import { EntitySearchResultComponent } from '../entity-search-result-component';

@rendersEntityType('Publication', ElementViewMode.SetElement)
@rendersEntityType(DEFAULT_ENTITY_TYPE, ElementViewMode.SetElement)
@Component({
  selector: 'ds-publication-list-element',
  styleUrls: ['./publication-list-element.component.scss'],
  templateUrl: './publication-list-element.component.html'
})
/**
 * The component for displaying a list element for an item with entity type Publication
 */
export class PublicationListElementComponent extends EntitySearchResultComponent {
}
