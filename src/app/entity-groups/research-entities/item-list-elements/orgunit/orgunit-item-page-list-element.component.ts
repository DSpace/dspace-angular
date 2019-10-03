import { Component } from '@angular/core';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../core/shared/context.model';
import { AbstractListableElementComponent } from '../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';
import { Item } from '../../../../core/shared/item.model';

@listableObjectComponent('OrgUnit', ViewMode.ListElement, Context.ItemPage)
@Component({
  selector: 'ds-orgunit-item-page-list-element',
  templateUrl: './orgunit-item-page-list-element.component.html'
})
/**
 * The component for displaying a list element for an item of the type OrgUnit
 */
export class OrgunitItemPageListElementComponent extends AbstractListableElementComponent<Item> {
}
