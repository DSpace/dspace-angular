import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import {
  DEFAULT_RELATIONSHIP_TYPE,
  rendersRelationshipType
} from '../../../../shared/entities/relationship-type-decorator';
import { ElementViewMode } from '../../../../shared/view-mode';
import { ITEM } from '../switcher/relationship-type-switcher.component';

@rendersRelationshipType('Item', ElementViewMode.Full)
@rendersRelationshipType(DEFAULT_RELATIONSHIP_TYPE, ElementViewMode.Full)
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
