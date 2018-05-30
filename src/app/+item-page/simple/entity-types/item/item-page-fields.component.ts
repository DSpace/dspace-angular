import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import {
  DEFAULT_ENTITY_TYPE,
  rendersEntityType
} from '../../../../shared/entities/entity-type-decorator';
import { ElementViewMode } from '../../../../shared/view-mode';
import { ITEM } from '../../../../shared/entities/switcher/entity-type-switcher.component';

@rendersEntityType('Item', ElementViewMode.Full)
@rendersEntityType(DEFAULT_ENTITY_TYPE, ElementViewMode.Full)
@Component({
  selector: 'ds-item-page-fields',
  styleUrls: ['./item-page-fields.component.scss'],
  templateUrl: './item-page-fields.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemPageFieldsComponent {

  constructor(@Inject(ITEM) public item: Item) {
  }

}
