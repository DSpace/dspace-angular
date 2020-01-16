import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { SearchPageRoutingModule } from './search-page-routing.module';
import { SearchComponent } from './search.component';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { EffectsModule } from '@ngrx/effects';
import { ConfigurationSearchPageComponent } from './configuration-search-page.component';
import { ConfigurationSearchPageGuard } from './configuration-search-page.guard';
import { SearchTrackerComponent } from './search-tracker.component';
import { StatisticsModule } from '../statistics/statistics.module';
import { SearchPageComponent } from './search-page.component';
import { SidebarFilterService } from '../shared/sidebar/filter/sidebar-filter.service';
import { SearchFilterService } from '../core/shared/search/search-filter.service';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';

const components = [
  SearchPageComponent,
  SearchComponent,
  ConfigurationSearchPageComponent,
  SearchTrackerComponent
];

@NgModule({
  imports: [
    SearchPageRoutingModule,
    CommonModule,
    SharedModule,
    CoreModule.forRoot(),
    StatisticsModule.forRoot(),
  ],
  declarations: components,
  providers: [
    SidebarService,
    SidebarFilterService,
    SearchFilterService,
    ConfigurationSearchPageGuard,
    SearchConfigurationService
  ],
  exports: components
})

/**
 * This module handles all components and pipes that are necessary for the search page
 */
export class SearchPageModule {
}
