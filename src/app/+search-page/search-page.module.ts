import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { SearchPageRoutingModule } from './search-page-routing.module';
import { SearchPageComponent } from './search-page.component';
import { ConfigurationSearchPageComponent } from './configuration-search-page.component';
import { ConfigurationSearchPageGuard } from './configuration-search-page.guard';
import { SearchTrackerComponent } from './search-tracker.component';
import { StatisticsModule } from '../statistics/statistics.module';
import { SearchComponent } from './search.component';

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
  providers: [ConfigurationSearchPageGuard],
  declarations: components,
  exports: components
})

/**
 * This module handles all components and pipes that are necessary for the search page
 */
export class SearchPageModule {
}
