import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { ConfigurationSearchPageGuard } from './configuration-search-page.guard';
import { StatisticsModule } from '../statistics/statistics.module';
import { SearchPageComponent } from './search-page.component';
import { SearchFilterService } from '../core/shared/search/search-filter.service';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { ThemedSearchPageComponent } from './themed-search-page.component';
import { SearchModule } from '../shared/search/search.module';

const components = [
  SearchPageComponent,
  ThemedSearchPageComponent
];

@NgModule({
    imports: [
        CommonModule,
        SearchModule,
        StatisticsModule.forRoot(),
        ...components
    ],
    providers: [
        SidebarService,
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
