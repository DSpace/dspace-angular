import { Component, Inject } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { rendersRelationshipType } from '../../../../shared/entities/relationship-type-decorator';
import { ElementViewMode } from '../../../../shared/view-mode';
import { ITEM } from '../switcher/relationship-type-switcher.component';

@rendersRelationshipType('Project', ElementViewMode.Full)
@Component({
  selector: 'ds-project-page-fields',
  styleUrls: ['./project-page-fields.component.scss'],
  templateUrl: './project-page-fields.component.html'
})
export class ProjectPageFieldsComponent {

  constructor(@Inject(ITEM) public item: Item) {
  }

}
