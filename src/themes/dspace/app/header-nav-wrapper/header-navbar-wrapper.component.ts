import { Component } from '@angular/core';
import { HeaderNavbarWrapperComponent as BaseComponent } from '../../../../app/header-nav-wrapper/header-navbar-wrapper.component';
import { slideMobileNav } from '../../../../app/shared/animations/slide';

/**
 * This component represents a wrapper for the horizontal navbar and the header
 */
@Component({
  selector: 'ds-header-navbar-wrapper',
  styleUrls: ['header-navbar-wrapper.component.scss'],
  templateUrl: 'header-navbar-wrapper.component.html',
  animations: [slideMobileNav],
})
export class HeaderNavbarWrapperComponent extends BaseComponent {
}
