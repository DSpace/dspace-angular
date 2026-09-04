import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';

import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { LogInContainerComponent } from '../../../../../app/shared/log-in/container/log-in-container.component';
import { LogInComponent as BaseComponent } from '../../../../../app/shared/log-in/log-in.component';
import { LogInMfaComponent } from '../../../../../app/shared/log-in/methods/mfa/log-in-mfa.component';

@Component({
  selector: 'ds-themed-log-in',
  // templateUrl: './log-in.component.html',
  templateUrl: '../../../../../app/shared/log-in/log-in.component.html',
  // styleUrls: ['./log-in.component.scss'],
  styleUrls: ['../../../../../app/shared/log-in/log-in.component.scss'],
  imports: [
    AsyncPipe,
    LogInContainerComponent,
    LogInMfaComponent,
    ThemedLoadingComponent,
  ],
})
export class LogInComponent extends BaseComponent {
}
