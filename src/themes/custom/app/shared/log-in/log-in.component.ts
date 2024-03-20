import {
  AsyncPipe,
  NgFor,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { ThemedLoadingComponent } from 'src/app/shared/loading/themed-loading.component';
import { LogInContainerComponent } from 'src/app/shared/log-in/container/log-in-container.component';

import { LogInComponent as BaseComponent } from '../../../../../app/shared/log-in/log-in.component';

@Component({
  selector: 'ds-log-in',
  // templateUrl: './log-in.component.html',
  templateUrl: '../../../../../app/shared/log-in/log-in.component.html',
  // styleUrls: ['./log-in.component.scss'],
  styleUrls: ['../../../../../app/shared/log-in/log-in.component.scss'],
  standalone: true,
  imports: [NgIf, ThemedLoadingComponent, NgFor, LogInContainerComponent, AsyncPipe],
})
export class LogInComponent extends BaseComponent {
}
