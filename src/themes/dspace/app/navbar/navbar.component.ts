import { Component } from '@angular/core';
import { NavbarComponent as BaseComponent } from '../../../../app/navbar/navbar.component';
import { slideMobileNav } from '../../../../app/shared/animations/slide';
import { TranslateModule } from '@ngx-translate/core';
import { ImpersonateNavbarComponent } from '../../../../app/shared/impersonate-navbar/impersonate-navbar.component';
import { ThemedAuthNavMenuComponent } from '../../../../app/shared/auth-nav-menu/themed-auth-nav-menu.component';
import { ContextHelpToggleComponent } from '../../../../app/header/context-help-toggle/context-help-toggle.component';
import { LangSwitchComponent } from '../../../../app/shared/lang-switch/lang-switch.component';
import { SearchNavbarComponent } from '../../../../app/search-navbar/search-navbar.component';
import { UserMenuComponent } from '../../../../app/shared/auth-nav-menu/user-menu/user-menu.component';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf, NgFor, NgComponentOutlet, AsyncPipe } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemedLangSwitchComponent } from 'src/app/shared/lang-switch/themed-lang-switch.component';
import { ThemedSearchNavbarComponent } from 'src/app/search-navbar/themed-search-navbar.component';
import { ThemedUserMenuComponent } from '../../../../app/shared/auth-nav-menu/user-menu/themed-user-menu.component';

/**
 * Component representing the public navbar
 */
@Component({
    selector: 'ds-navbar',
    styleUrls: ['./navbar.component.scss'],
    templateUrl: './navbar.component.html',
    animations: [slideMobileNav],
    standalone: true,
    imports: [NgbDropdownModule, ThemedLangSwitchComponent, ThemedSearchNavbarComponent, NgClass, RouterLink, NgIf, UserMenuComponent, NgFor, NgComponentOutlet, SearchNavbarComponent, LangSwitchComponent, ContextHelpToggleComponent, ThemedAuthNavMenuComponent, ImpersonateNavbarComponent, AsyncPipe, TranslateModule, ThemedUserMenuComponent]
})
export class NavbarComponent extends BaseComponent {
}
