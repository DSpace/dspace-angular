import {
  ItemBackButtonComponent as BaseComponent
} from '../../../../../app/shared/item-back-button/item-back-button.component';
import { Component } from '@angular/core';

@Component({
  selector: 'ds-item-back-button',
  // styleUrls: ['./item-back-button.component.scss'],
  styleUrls: ['../../../../../app/shared/item-back-button/item-back-button.component.scss'],
  //templateUrl: './item-back-button.component.html',
  templateUrl: '../../../../../app/shared/item-back-button/item-back-button.component.html'
})
export class ItemBackButtonComponent extends BaseComponent {}
