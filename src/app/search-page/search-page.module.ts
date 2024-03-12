import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { SearchFilterService } from '../core/shared/search/search-filter.service';
import { SearchModule } from '../shared/search/search.module';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { StatisticsModule } from '../statistics/statistics.module';
import { ConfigurationSearchPageGuard } from './configuration-search-page.guard';
import { SearchPageComponent } from './search-page.component';
import { ThemedSearchPageComponent } from './themed-search-page.component';

const components = [
  SearchPageComponent,
  ThemedSearchPageComponent,
];

@NgModule({
  imports: [
    CommonModule,
    SearchModule,
    StatisticsModule.forRoot(),
    ...components,
  ],
  providers: [
    SidebarService,
    SearchFilterService,
    ConfigurationSearchPageGuard,
    SearchConfigurationService,
  ],
  exports: components,
})

/**
 * This module handles all components and pipes that are necessary for the search page
 */
export class SearchPageModule {
}
