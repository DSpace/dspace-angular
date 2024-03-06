import { Component } from '@angular/core';
import { ThemedHeaderComponent } from '../../../../app/header/themed-header.component';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { ThemedNavbarComponent } from '../../../../app/navbar/themed-navbar.component';
import { HeaderNavbarWrapperComponent as BaseComponent } from '../../../../app/header-nav-wrapper/header-navbar-wrapper.component';
import { slideMobileNav } from '../../../../app/shared/animations/slide';
import { TranslateModule } from '@ngx-translate/core';

/**
 * This component represents a wrapper for the horizontal navbar and the header
 */
@Component({
  selector: 'ds-header-navbar-wrapper',
  styleUrls: ['header-navbar-wrapper.component.scss'],
  templateUrl: 'header-navbar-wrapper.component.html',
  standalone: true,
  imports: [NgClass, ThemedHeaderComponent, ThemedNavbarComponent, AsyncPipe, TranslateModule, NgIf],
  animations: [slideMobileNav],
})
export class HeaderNavbarWrapperComponent extends BaseComponent {
}
