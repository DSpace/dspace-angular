import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ThemedUserMenuComponent } from 'src/app/shared/auth-nav-menu/user-menu/themed-user-menu.component';

import { NavbarComponent as BaseComponent } from '../../../../app/navbar/navbar.component';
import { slideMobileNav } from '../../../../app/shared/animations/slide';
import { MenuComponentLoaderComponent } from '../../../../app/shared/menu/menu-component-loader/menu-component-loader.component';

@Component({
  selector: 'ds-themed-navbar',
  // styleUrls: ['./navbar.component.scss'],
  styleUrls: ['../../../../app/navbar/navbar.component.scss'],
  // templateUrl: './navbar.component.html',
  templateUrl: '../../../../app/navbar/navbar.component.html',
  animations: [slideMobileNav],
  standalone: true,
  imports: [
    AsyncPipe,
    MenuComponentLoaderComponent,
    NgbDropdownModule,
    NgClass,
    ThemedUserMenuComponent,
    TranslateModule,
  ],
})
export class NavbarComponent extends BaseComponent {
}
