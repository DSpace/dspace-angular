import { Component } from '@angular/core';
import {
  HeaderNavbarWrapperComponent as BaseComponent
} from '../../../../app/header-nav-wrapper/header-navbar-wrapper.component';
import { ThemedHeaderComponent } from '../../../../app/header/themed-header.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { ThemedNavbarComponent } from '../../../../app/navbar/themed-navbar.component';

/**
 * This component represents a wrapper for the horizontal navbar and the header
 */
@Component({
  selector: 'ds-header-navbar-wrapper',
  styleUrls: ['header-navbar-wrapper.component.scss'],
  templateUrl: 'header-navbar-wrapper.component.html',
  standalone: true,
  imports: [NgClass, ThemedHeaderComponent, ThemedNavbarComponent, AsyncPipe]
})
export class HeaderNavbarWrapperComponent extends BaseComponent {
}
