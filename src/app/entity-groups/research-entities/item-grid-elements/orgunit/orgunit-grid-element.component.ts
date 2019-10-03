import { Component } from '@angular/core';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { AbstractListableElementComponent } from '../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';
import { Item } from '../../../../core/shared/item.model';

@listableObjectComponent('OrgUnit', ViewMode.GridElement)
@Component({
  selector: 'ds-orgunit-grid-element',
  styleUrls: ['./orgunit-grid-element.component.scss'],
  templateUrl: './orgunit-grid-element.component.html',
})
/**
 * The component for displaying a grid element for an item of the type Organisation Unit
 */
export class OrgunitGridElementComponent extends AbstractListableElementComponent<Item> {
}
