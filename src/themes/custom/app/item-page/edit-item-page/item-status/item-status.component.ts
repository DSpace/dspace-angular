import { ChangeDetectionStrategy, Component } from '@angular/core';
import { fadeIn, fadeInOut } from '../../../../../../app/shared/animations/fade';
import { ItemStatusComponent as BaseComponent } from '../../../../../../app/item-page/edit-item-page/item-status/item-status.component';

@Component({
  selector: 'ds-item-status',
  // templateUrl: './item-status.component.html',
  templateUrl: '../../../../../../app/item-page/edit-item-page/item-status/item-status.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    fadeIn,
    fadeInOut
  ]
})
export class ItemStatusComponent extends BaseComponent {
}
