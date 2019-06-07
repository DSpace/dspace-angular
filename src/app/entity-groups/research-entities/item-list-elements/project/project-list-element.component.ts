import { Component } from '@angular/core';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { TypedItemSearchResultListElementComponent } from '../../../../shared/object-list/item-list-element/item-types/typed-item-search-result-list-element.component';

@rendersItemType('Project', ItemViewMode.Element)
@Component({
  selector: 'ds-project-list-element',
  styleUrls: ['./project-list-element.component.scss'],
  templateUrl: './project-list-element.component.html'
})
/**
 * The component for displaying a list element for an item of the type Project
 */
export class ProjectListElementComponent extends TypedItemSearchResultListElementComponent {
}
