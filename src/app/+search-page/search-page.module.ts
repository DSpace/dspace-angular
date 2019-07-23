import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { SearchPageRoutingModule } from './search-page-routing.module';
import { SearchPageComponent } from './search-page.component';
import { FilteredSearchPageComponent } from './filtered-search-page.component';
import { ConfigurationSearchPageGuard } from './configuration-search-page.guard';


const components = [
  SearchPageComponent,
  FilteredSearchPageComponent
];

@NgModule({
  imports: [
    SearchPageRoutingModule,
    CommonModule,
    SharedModule,
    CoreModule.forRoot()
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
