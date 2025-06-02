import { Component } from '@angular/core';

import { Item } from '../../../../core/shared/item.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { AbstractListableElementComponent } from '../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';
import { OrgUnitSearchResultGridElementComponent } from '../search-result-grid-elements/org-unit/org-unit-search-result-grid-element.component';

@listableObjectComponent('OrgUnit', ViewMode.GridElement)
@Component({
  selector: 'ds-org-unit-grid-element',
  styleUrls: ['./org-unit-grid-element.component.scss'],
  templateUrl: './org-unit-grid-element.component.html',
  standalone: true,
  imports: [OrgUnitSearchResultGridElementComponent],
})
/**
 * The component for displaying a grid element for an item of the type Organisation Unit
 */
export class OrgUnitGridElementComponent extends AbstractListableElementComponent<Item> {
}
