import { Component } from '@angular/core';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { ItemComponent } from '../../../../+item-page/simple/item-types/shared/item.component';

@rendersItemType('Project', ItemViewMode.Full)
@Component({
  selector: 'ds-project',
  styleUrls: ['./project.component.scss'],
  templateUrl: './project.component.html'
})
/**
 * The component for displaying metadata and relations of an item of the type Project
 */
export class ProjectComponent extends ItemComponent {
}
