import { Component, Inject } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { rendersEntityType } from '../../../../shared/entities/entity-type-decorator';
import { ElementViewMode } from '../../../../shared/view-mode';
import { ITEM } from '../../../../shared/entities/switcher/entity-type-switcher.component';

@rendersEntityType('OrgUnit', ElementViewMode.Full)
@Component({
  selector: 'ds-orgunit-page-fields',
  styleUrls: ['./orgunit-page-fields.component.scss'],
  templateUrl: './orgunit-page-fields.component.html'
})
export class OrgUnitPageFieldsComponent {

  constructor(@Inject(ITEM) public item: Item) {
  }

}
