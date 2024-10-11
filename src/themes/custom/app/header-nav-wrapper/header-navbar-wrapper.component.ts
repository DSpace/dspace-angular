import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import { Component } from '@angular/core';

import { ThemedHeaderComponent } from '../../../../app/header/themed-header.component';
import { HeaderNavbarWrapperComponent as BaseComponent } from '../../../../app/header-nav-wrapper/header-navbar-wrapper.component';
import { ThemedNavbarComponent } from '../../../../app/navbar/themed-navbar.component';

@Component({
  selector: 'ds-themed-header-navbar-wrapper',
  // styleUrls: ['./header-navbar-wrapper.component.scss'],
  styleUrls: ['../../../../app/header-nav-wrapper/header-navbar-wrapper.component.scss'],
  // templateUrl: './header-navbar-wrapper.component.html',
  templateUrl: '../../../../app/header-nav-wrapper/header-navbar-wrapper.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    ThemedHeaderComponent,
    ThemedNavbarComponent,
  ],
})
export class HeaderNavbarWrapperComponent extends BaseComponent {
}
