import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  DEFAULT_ITEM_TYPE, ItemViewMode,
  rendersItemType
} from '../../../../shared/items/item-type-decorator';
import { ItemComponent } from '../shared/item.component';

@rendersItemType('Publication', ItemViewMode.Detail)
@rendersItemType(DEFAULT_ITEM_TYPE, ItemViewMode.Detail)
@Component({
  selector: 'ds-publication',
  styleUrls: ['./publication.component.scss'],
  templateUrl: './publication.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationComponent extends ItemComponent {
}
