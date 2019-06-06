import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { Component } from '@angular/core';
import { focusShadow } from '../../../../shared/animations/focus';
import { TypedItemSearchResultGridElementComponent } from '../../../../shared/object-grid/item-grid-element/item-types/typed-item-search-result-grid-element.component';

@rendersItemType('Project', ItemViewMode.Card)
@Component({
  selector: 'ds-project-grid-element',
  styleUrls: ['./project-grid-element.component.scss'],
  templateUrl: './project-grid-element.component.html',
  animations: [focusShadow]
})
export class ProjectGridElementComponent extends TypedItemSearchResultGridElementComponent {
}
