import {
  AsyncPipe,
  NgClass,
  NgIf,
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

/**
 * Component representing the {@link UserMenuComponent} of a page
 */
@Component({
  selector: 'ds-themed-user-menu',
  // templateUrl: 'user-menu.component.html',
  templateUrl: '../../../../../../app/shared/auth-nav-menu/user-menu/user-menu.component.html',
  // styleUrls: ['user-menu.component.scss'],
  styleUrls: ['../../../../../../app/shared/auth-nav-menu/user-menu/user-menu.component.scss'],
  standalone: true,
  imports: [NgIf, ThemedLoadingComponent, RouterLinkActive, NgClass, RouterLink, LogOutComponent, AsyncPipe, TranslateModule],

})
export class UserMenuComponent extends BaseComponent {
}
