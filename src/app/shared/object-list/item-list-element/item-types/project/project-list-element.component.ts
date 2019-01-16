import { Component } from '@angular/core';
import { rendersItemType } from '../../../../items/item-type-decorator';
import { ElementViewMode } from '../../../../view-mode';
import { ItemSearchResultComponent } from '../item-search-result-component';

@rendersItemType('Project', ElementViewMode.SetElement)
@Component({
  selector: 'ds-project-list-element',
  styleUrls: ['./project-list-element.component.scss'],
  templateUrl: './project-list-element.component.html'
})
/**
 * The component for displaying a list element for an item of the type Project
 */
export class ProjectListElementComponent extends ItemSearchResultComponent {
}
