import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '../core/core.module';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { SearchFilterService } from '../core/shared/search/search-filter.service';
import { JournalEntitiesModule } from '../entity-groups/journal-entities/journal-entities.module';
import { ResearchEntitiesModule } from '../entity-groups/research-entities/research-entities.module';
import { SearchModule } from '../shared/search/search.module';
import { SharedModule } from '../shared/shared.module';
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
    SharedModule.withEntryComponents(),
    CoreModule.forRoot(),
    StatisticsModule.forRoot(),
    JournalEntitiesModule.withEntryComponents(),
    ResearchEntitiesModule.withEntryComponents(),
  ],
  declarations: components,
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
