import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import { Component } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ThemedLoadingComponent } from 'src/app/shared/loading/themed-loading.component';
import { LogOutComponent } from 'src/app/shared/log-out/log-out.component';

import { UserMenuComponent as BaseComponent } from '../../../../../../app/shared/auth-nav-menu/user-menu/user-menu.component';

@Component({
  selector: 'ds-themed-user-menu',
  // templateUrl: 'user-menu.component.html',
  templateUrl: '../../../../../../app/shared/auth-nav-menu/user-menu/user-menu.component.html',
  // styleUrls: ['user-menu.component.scss'],
  styleUrls: ['../../../../../../app/shared/auth-nav-menu/user-menu/user-menu.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    LogOutComponent,
    NgClass,
    RouterLink,
    RouterLinkActive,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
export class UserMenuComponent extends BaseComponent {
}
