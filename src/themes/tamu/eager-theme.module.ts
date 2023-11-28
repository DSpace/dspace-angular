import { CdkTreeModule } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommunityListService } from '../../app/community-list-page/community-list-service';
import { CommunityPageModule } from '../../app/community-page/community-page.module';
import { NavbarModule } from '../../app/navbar/navbar.module';
import { RootModule } from '../../app/root.module';
import { SharedBrowseByModule } from '../../app/shared/browse-by/shared-browse-by.module';
import { ComcolModule } from '../../app/shared/comcol/comcol.module';
import { DsoPageModule } from '../../app/shared/dso-page/dso-page.module';
import { ResultsBackButtonModule } from '../../app/shared/results-back-button/results-back-button.module';
import { SharedModule } from '../../app/shared/shared.module';
import { StatisticsModule } from '../../app/statistics/statistics.module';
import { CommunityListComponent } from './app/community-list-page/community-list/community-list.component';
import { CommunityPageComponent } from './app/community-page/community-page.component';
import { HeaderNavbarWrapperComponent } from './app/header-nav-wrapper/header-navbar-wrapper.component';
import { HeaderComponent } from './app/header/header.component';
import { HomeNewsComponent } from './app/home-page/home-news/home-news.component';
import { NavbarComponent } from './app/navbar/navbar.component';

/**
 * Add components that use a custom decorator to ENTRY_COMPONENTS as well as DECLARATIONS.
 * This will ensure that decorator gets picked up when the app loads
 */
const ENTRY_COMPONENTS = [
  CommunityPageComponent
];

const DECLARATIONS = [
  ...ENTRY_COMPONENTS,
  CommunityListComponent,
  HomeNewsComponent,
  HeaderComponent,
  HeaderNavbarWrapperComponent,
  NavbarComponent,
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedBrowseByModule,
    ResultsBackButtonModule,
    RootModule,
    NavbarModule,
    ComcolModule,
    DsoPageModule,
    StatisticsModule,
    CommunityPageModule,
    CdkTreeModule,
  ],
  declarations: DECLARATIONS,
  providers: [
    ...ENTRY_COMPONENTS.map((component) => ({provide: component})),
    CommunityListService,
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
