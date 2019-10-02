import { Component } from '@angular/core';
import { TypedItemSearchResultListElementComponent } from '../../../../shared/object-list/item-list-element/item-types/typed-item-search-result-list-element.component';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { Context } from '../../../../core/shared/context.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';

@listableObjectComponent('OrgUnit', ViewMode.ListElement, Context.ItemPage)
@Component({
  selector: 'ds-person-item-page-list-element',
  templateUrl: './person-item-page-list-element.component.html'
})
/**
 * The component for displaying a list element for an item of the type Person
 */
export class PersonItemPageListElementComponent extends TypedItemSearchResultListElementComponent {
}
