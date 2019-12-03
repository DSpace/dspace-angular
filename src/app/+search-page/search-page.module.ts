import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { SearchPageRoutingModule } from './search-page-routing.module';
import { SearchPageComponent } from './search-page.component';
import { ConfigurationSearchPageComponent } from './configuration-search-page.component';
import { ConfigurationSearchPageGuard } from './configuration-search-page.guard';
import { FilteredSearchPageComponent } from './filtered-search-page.component';
import { EffectsModule } from '@ngrx/effects';
import { SearchComponent } from './search.component';
import { SearchTrackerComponent } from './search-tracker.component';
import { StatisticsModule } from '../statistics/statistics.module';

const components = [
  SearchPageComponent,
  SearchComponent,
  FilteredSearchPageComponent,
  ConfigurationSearchPageComponent,
  SearchTrackerComponent,

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
