import { Component, Inject } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { rendersRelationshipType } from '../../../../shared/entities/relationship-type-decorator';
import { ElementViewMode } from '../../../../shared/view-mode';
import { ITEM } from '../switcher/relationship-type-switcher.component';

@rendersRelationshipType('Person', ElementViewMode.Full)
@Component({
  selector: 'ds-person-page-fields',
  styleUrls: ['./person-page-fields.component.scss'],
  templateUrl: './person-page-fields.component.html'
})
export class PersonPageFieldsComponent {

  constructor(@Inject(ITEM) public item: Item) {
  }

}
