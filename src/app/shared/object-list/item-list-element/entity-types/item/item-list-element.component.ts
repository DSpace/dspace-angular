import { Component } from '@angular/core';
import { DEFAULT_ENTITY_TYPE, rendersEntityType } from '../../../../entities/entity-type-decorator';
import { ElementViewMode } from '../../../../view-mode';
import { EntitySearchResultComponent } from '../entity-search-result-component';

@rendersEntityType('Item', ElementViewMode.SetElement)
@rendersEntityType(DEFAULT_ENTITY_TYPE, ElementViewMode.SetElement)
@Component({
  selector: 'ds-item-list-element',
  styleUrls: ['./item-list-element.component.scss'],
  templateUrl: './item-list-element.component.html'
})

export class ItemListElementComponent extends EntitySearchResultComponent {
}
