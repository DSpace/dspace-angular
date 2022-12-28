import { Component } from '@angular/core';
import {
  ItemMetadataComponent as BaseComponent
} from '../../../../../../app/item-page/edit-item-page/item-metadata/item-metadata.component';

@Component({
  selector: 'ds-item-metadata',
  // styleUrls: ['./item-metadata.component.scss'],
  styleUrls: ['../../../../../../app/item-page/edit-item-page/item-metadata/item-metadata.component.scss'],
  // templateUrl: './item-metadata.component.html',
  templateUrl: '../../../../../../app/item-page/edit-item-page/item-metadata/item-metadata.component.html',
})
/**
 * Component for displaying an item's metadata edit page
 */
export class ItemMetadataComponent extends BaseComponent {
}
