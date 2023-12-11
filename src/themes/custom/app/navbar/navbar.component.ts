import { Component } from '@angular/core';
import { NavbarComponent as BaseComponent } from '../../../../app/navbar/navbar.component';
import { slideMobileNav } from '../../../../app/shared/animations/slide';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe, NgClass, NgComponentOutlet, NgFor, NgIf } from '@angular/common';
import { UserMenuComponent } from '../../../../app/shared/auth-nav-menu/user-menu/user-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { ThemedUserMenuComponent } from 'src/app/shared/auth-nav-menu/user-menu/themed-user-menu.component';

/**
 * Component representing the public navbar
 */
@Component({
  selector: 'ds-navbar',
  // styleUrls: ['./navbar.component.scss'],
  styleUrls: ['../../../../app/navbar/navbar.component.scss'],
  // templateUrl: './navbar.component.html',
  templateUrl: '../../../../app/navbar/navbar.component.html',
  animations: [slideMobileNav],
  standalone: true,
  imports: [NgbDropdownModule, NgClass, NgIf, UserMenuComponent, ThemedUserMenuComponent, NgFor, NgComponentOutlet, AsyncPipe, TranslateModule]
})
export class NavbarComponent extends BaseComponent {
}
