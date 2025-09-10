import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RootModule } from '../../app/root.module';
import { HeaderNavbarWrapperComponent } from './app/header-nav-wrapper/header-navbar-wrapper.component';
import { HeaderComponent } from './app/header/header.component';
import { HomeNewsComponent } from './app/home-page/home-news/home-news.component';
import { NavbarComponent } from './app/navbar/navbar.component';

// TAMU Customizations
import { LoginPageComponent } from './app/login-page/login-page.component';
import { LogoutPageComponent } from './app/logout-page/logout-page.component';
import { CommunityListComponent } from './app/community-list-page/community-list/community-list.component';
import { CommunityPageSubCollectionListComponent } from './app/community-page/sections/sub-com-col-section/sub-collection-list/community-page-sub-collection-list.component';
import { CommunityPageSubCommunityListComponent } from './app/community-page/sections/sub-com-col-section/sub-community-list/community-page-sub-community-list.component';
import { StartsWithTextComponent } from './app/shared/starts-with/text/starts-with-text.component';
import { SubmissionSectionLicenseComponent } from './app/submission/sections/license/section-license.component';
// END TAMU Customizations

/**
 * Add components that use a custom decorator to ENTRY_COMPONENTS as well as DECLARATIONS.
 * This will ensure that decorator gets picked up when the app loads
 */
const ENTRY_COMPONENTS = [];

const DECLARATIONS = [
  ...ENTRY_COMPONENTS,
  HomeNewsComponent,
  HeaderComponent,
  HeaderNavbarWrapperComponent,
  NavbarComponent,
  // TAMU Customizations
  CommunityListComponent,
  CommunityPageSubCollectionListComponent,
  CommunityPageSubCommunityListComponent,
  LoginPageComponent,
  LogoutPageComponent,
  StartsWithTextComponent,
  SubmissionSectionLicenseComponent,
  // END TAMU Customizations
];

@NgModule({
  imports: [
    CommonModule,
    RootModule,
    ...DECLARATIONS,
  ],
  providers: [
    ...ENTRY_COMPONENTS.map((component) => ({ provide: component })),
  ],
})
/**
 * This module is included in the main bundle that gets downloaded at first page load. So it should
 * contain only the themed components that have to be available immediately for the first page load,
 * and the minimal set of imports required to make them work. Anything you can cut from it will make
 * the initial page load faster, but may cause the page to flicker as components that were already
 * rendered server side need to be lazy-loaded again client side
 *
 * Themed EntryComponents should also be added here
 */
export class EagerThemeModule {
}
