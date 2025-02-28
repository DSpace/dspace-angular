import { ChangeDetectionStrategy, Component } from '@angular/core';
import { fadeIn, fadeInOut } from 'src/app/shared/animations/fade';
import {
  ItemCollectionMapperComponent as BaseComponent
} from '../../../../../../app/item-page/edit-item-page/item-collection-mapper/item-collection-mapper.component';

@Component({
  selector: 'ds-item-collection-mapper',
  styleUrls: ['../../../../../../app/item-page/edit-item-page/item-collection-mapper/item-collection-mapper.component.scss'],
  // styleUrls: ['./item-collection-mapper.component.scss'],
  templateUrl: '../../../../../../app/item-page/edit-item-page/item-collection-mapper/item-collection-mapper.component.html',
  // templateUrl: './item-collection-mapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut
  ]
})

export class ItemCollectionMapperComponent extends BaseComponent {

}
