import { Component } from '@angular/core';
import { TypedItemSearchResultListElementComponent } from '../../../../shared/object-list/item-list-element/item-types/typed-item-search-result-list-element.component';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../core/shared/context.model';

@listableObjectComponent('OrgUnit', ViewMode.ListElement, Context.ItemPage)
@Component({
  selector: 'ds-orgunit-item-page-list-element',
  templateUrl: './orgunit-item-page-list-element.component.html'
})
/**
 * The component for displaying a list element for an item of the type OrgUnit
 */
export class OrgunitItemPageListElementComponent extends TypedItemSearchResultListElementComponent {
}
