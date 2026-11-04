import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';

import { ItemAccessControlComponent as BaseComponent } from '../../../../../../app/item-page/edit-item-page/item-access-control/item-access-control.component';
import { AccessControlFormContainerComponent } from '../../../../../../app/shared/access-control-form-container/access-control-form-container.component';

@Component({
  selector: 'ds-themed-item-access-control',
  styleUrls: ['../../../../../../app/item-page/edit-item-page/item-access-control/item-access-control.component.scss'],
  // styleUrls: ['./item-access-control.component.scss'],
  templateUrl: '../../../../../../app/item-page/edit-item-page/item-access-control/item-access-control.component.html',
  // templateUrl: './item-access-control.component.html',
  imports: [
    AccessControlFormContainerComponent,
    AsyncPipe,
  ],
})
export class ItemAccessControlComponent extends BaseComponent {
}
