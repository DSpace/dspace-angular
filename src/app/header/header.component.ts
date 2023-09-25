import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuService } from '../shared/menu/menu.service';
import { MenuID } from '../shared/menu/menu-id.model';
import { TranslateModule } from '@ngx-translate/core';
import { ImpersonateNavbarComponent } from '../shared/impersonate-navbar/impersonate-navbar.component';
import { ThemedAuthNavMenuComponent } from '../shared/auth-nav-menu/themed-auth-nav-menu.component';
import { ContextHelpToggleComponent } from './context-help-toggle/context-help-toggle.component';
import { LangSwitchComponent } from '../shared/lang-switch/lang-switch.component';
import { ThemedSearchNavbarComponent } from '../search-navbar/themed-search-navbar.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';

/**
 * Represents the header with the logo and simple navigation
 */
@Component({
    selector: 'ds-header',
    styleUrls: ['header.component.scss'],
    templateUrl: 'header.component.html',
    standalone: true,
    imports: [RouterLink, NgbDropdownModule, ThemedSearchNavbarComponent, LangSwitchComponent, ContextHelpToggleComponent, ThemedAuthNavMenuComponent, ImpersonateNavbarComponent, TranslateModule]
})
export class HeaderComponent {
  /**
   * Whether user is authenticated.
   * @type {Observable<string>}
   */
  public isAuthenticated: Observable<boolean>;
  public showAuth = false;
  menuID = MenuID.PUBLIC;

  constructor(
    private menuService: MenuService
  ) {
  }

  public toggleNavbar(): void {
    this.menuService.toggleMenu(this.menuID);
  }
}
