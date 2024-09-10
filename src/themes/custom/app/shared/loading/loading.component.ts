import {
  NgIf,
  NgSwitch,
  NgSwitchCase,
} from '@angular/common';
import { Component } from '@angular/core';

import { AlertComponent } from '../../../../../app/shared/alert/alert.component';
import { LoadingComponent as BaseComponent } from '../../../../../app/shared/loading/loading.component';

@Component({
  selector: 'ds-themed-loading',
  styleUrls: ['../../../../../app/shared/loading/loading.component.scss'],
  // styleUrls: ['./loading.component.scss'],
  templateUrl: '../../../../../app/shared/loading/loading.component.html',
  // templateUrl: './loading.component.html'
  standalone: true,
  imports: [NgIf, NgSwitchCase, NgSwitch, AlertComponent],
})
export class LoadingComponent extends BaseComponent {

}
