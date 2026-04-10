import { Component } from '@angular/core';

import { ThemedHeaderComponent } from '../../../../app/header/themed-header.component';
import { HeaderNavbarWrapperComponent as BaseComponent } from '../../../../app/header-nav-wrapper/header-navbar-wrapper.component';

@Component({
  selector: 'ds-themed-header-navbar-wrapper',
  styleUrls: ['../../../../app/header-nav-wrapper/header-navbar-wrapper.component.scss'],
  templateUrl: './header-navbar-wrapper.component.html',
  imports: [
    ThemedHeaderComponent,
  ],
})
export class HeaderNavbarWrapperComponent extends BaseComponent {
}
