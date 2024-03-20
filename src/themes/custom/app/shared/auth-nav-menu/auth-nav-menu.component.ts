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
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ThemedUserMenuComponent } from 'src/app/shared/auth-nav-menu/user-menu/themed-user-menu.component';
import { ThemedLogInComponent } from 'src/app/shared/log-in/themed-log-in.component';

import {
  fadeInOut,
  fadeOut,
} from '../../../../../app/shared/animations/fade';
import { AuthNavMenuComponent as BaseComponent } from '../../../../../app/shared/auth-nav-menu/auth-nav-menu.component';
import { UserMenuComponent } from '../../../../../app/shared/auth-nav-menu/user-menu/user-menu.component';
import { LogInComponent } from '../../../../../app/shared/log-in/log-in.component';
import { BrowserOnlyPipe } from '../../../../../app/shared/utils/browser-only.pipe';

/**
 * Component representing the {@link AuthNavMenuComponent} of a page
 */
@Component({
  selector: 'ds-auth-nav-menu',
  // templateUrl: './auth-nav-menu.component.html',
  templateUrl: '../../../../../app/shared/auth-nav-menu/auth-nav-menu.component.html',
  // styleUrls: ['./auth-nav-menu.component.scss'],
  styleUrls: ['../../../../../app/shared/auth-nav-menu/auth-nav-menu.component.scss'],
  animations: [fadeInOut, fadeOut],
  standalone: true,
  imports: [NgClass, NgIf, NgbDropdownModule, LogInComponent, ThemedLogInComponent, RouterLink, RouterLinkActive, UserMenuComponent, ThemedUserMenuComponent, AsyncPipe, TranslateModule, BrowserOnlyPipe],
})
export class AuthNavMenuComponent extends BaseComponent {
}
