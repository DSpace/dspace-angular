import { Component } from '@angular/core';
import { fadeInOut } from '../../../../../../../app/shared/animations/fade';
import { ItemListPreviewComponent as BaseComponent } from '../../../../../../../app/shared/object-list/my-dspace-result-list-element/item-list-preview/item-list-preview.component';

@Component({
  selector: 'ds-item-list-preview',
  // styleUrls: ['./item-list-preview.component.scss'],
  styleUrls: ['../../../../../../../app/shared/object-list/my-dspace-result-list-element/item-list-preview/item-list-preview.component.scss'],
  // templateUrl: './item-list-preview.component.html',
  templateUrl: '../../../../../../../app/shared/object-list/my-dspace-result-list-element/item-list-preview/item-list-preview.component.html',
  animations: [fadeInOut],
})
export class ItemListPreviewComponent extends BaseComponent {
}
