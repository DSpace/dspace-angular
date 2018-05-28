import { Component, Inject } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { rendersRelationshipType } from '../../../../shared/entities/relationship-type-decorator';
import { ElementViewMode } from '../../../../shared/view-mode';
import { ITEM } from '../switcher/relationship-type-switcher.component';

@rendersRelationshipType('OrgUnit', ElementViewMode.Full)
@Component({
  selector: 'ds-orgunit-page-fields',
  styleUrls: ['./orgunit-page-fields.component.scss'],
  templateUrl: './orgunit-page-fields.component.html'
})
export class OrgUnitPageFieldsComponent {

  constructor(@Inject(ITEM) public item: Item) {
  }

}
