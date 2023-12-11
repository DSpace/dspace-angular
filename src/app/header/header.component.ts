import { Component, OnInit } from '@angular/core';
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
import { HostWindowService } from '../shared/host-window.service';
import { ThemedLangSwitchComponent } from '../shared/lang-switch/themed-lang-switch.component';

/**
 * Represents the header with the logo and simple navigation
 */
@Component({
    selector: 'ds-header',
    styleUrls: ['header.component.scss'],
    templateUrl: 'header.component.html',
    standalone: true,
    imports: [RouterLink, ThemedLangSwitchComponent, NgbDropdownModule, ThemedSearchNavbarComponent, LangSwitchComponent, ContextHelpToggleComponent, ThemedAuthNavMenuComponent, ImpersonateNavbarComponent, TranslateModule]
})
export class HeaderComponent implements OnInit {
  /**
   * Whether user is authenticated.
   * @type {Observable<string>}
   */
  public isAuthenticated: Observable<boolean>;
  public isXsOrSm$: Observable<boolean>;
  menuID = MenuID.PUBLIC;

  constructor(
    protected menuService: MenuService,
    protected windowService: HostWindowService,
  ) {
  }

  ngOnInit(): void {
    this.isXsOrSm$ = this.windowService.isXsOrSm();
  }

  public toggleNavbar(): void {
    this.menuService.toggleMenu(this.menuID);
  }
}
