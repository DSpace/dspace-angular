import { Component, Inject } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { rendersEntityType } from '../../../../shared/entities/entity-type-decorator';
import { ElementViewMode } from '../../../../shared/view-mode';
import { ITEM } from '../switcher/entity-type-switcher.component';

@rendersEntityType('Project', ElementViewMode.Full)
@Component({
  selector: 'ds-project-page-fields',
  styleUrls: ['./project-page-fields.component.scss'],
  templateUrl: './project-page-fields.component.html'
})
export class ProjectPageFieldsComponent {

  constructor(@Inject(ITEM) public item: Item) {
  }

}
