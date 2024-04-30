import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { LoadingComponent as BaseComponent } from '../../../../../app/shared/loading/loading.component';

@Component({
  selector: 'ds-themed-loading',
  styleUrls: ['../../../../../app/shared/loading/loading.component.scss'],
  // styleUrls: ['./loading.component.scss'],
  templateUrl: '../../../../../app/shared/loading/loading.component.html',
  // templateUrl: './loading.component.html'
  standalone: true,
  imports: [NgIf],
})
export class LoadingComponent extends BaseComponent {

}
