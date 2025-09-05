/* eslint-disable dspace-angular-ts/themed-component-usages */
import { HeaderComponent } from './app/header/header.component';
import { HeaderNavbarWrapperComponent } from './app/header-nav-wrapper/header-navbar-wrapper.component';
import { HomeNewsComponent } from './app/home-page/home-news/home-news.component';
import { NavbarComponent } from './app/navbar/navbar.component';

/**
 * Components that should be eagerly loaded. Only add components here that are present on every page.
 * This improves the initial loading speed.
 */
export const COMPONENTS = [
  HomeNewsComponent,
  HeaderComponent,
  HeaderNavbarWrapperComponent,
  NavbarComponent,
];
