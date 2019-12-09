import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { SearchPageRoutingModule } from './search-page-routing.module';
import { SearchComponent } from './search.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { CommunitySearchResultGridElementComponent } from '../shared/object-grid/search-result-grid-element/community-search-result/community-search-result-grid-element.component'
import { CollectionSearchResultGridElementComponent } from '../shared/object-grid/search-result-grid-element/collection-search-result/collection-search-result-grid-element.component';
import { SearchSidebarComponent } from './search-sidebar/search-sidebar.component';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { SidebarEffects } from '../shared/sidebar/sidebar-effects.service';
import { SearchSettingsComponent } from './search-settings/search-settings.component';
import { EffectsModule } from '@ngrx/effects';
import { SearchFiltersComponent } from './search-filters/search-filters.component';
import { SearchFilterComponent } from './search-filters/search-filter/search-filter.component';
import { SearchFacetFilterComponent } from './search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { SearchFilterService } from './search-filters/search-filter/search-filter.service';
import { SearchFixedFilterService } from './search-filters/search-filter/search-fixed-filter.service';
import { SearchLabelsComponent } from './search-labels/search-labels.component';
import { SearchRangeFilterComponent } from './search-filters/search-filter/search-range-filter/search-range-filter.component';
import { SearchTextFilterComponent } from './search-filters/search-filter/search-text-filter/search-text-filter.component';
import { SearchFacetFilterWrapperComponent } from './search-filters/search-filter/search-facet-filter-wrapper/search-facet-filter-wrapper.component';
import { SearchBooleanFilterComponent } from './search-filters/search-filter/search-boolean-filter/search-boolean-filter.component';
import { SearchHierarchyFilterComponent } from './search-filters/search-filter/search-hierarchy-filter/search-hierarchy-filter.component';
import { SearchConfigurationService } from './search-service/search-configuration.service';
import { SearchFacetOptionComponent } from './search-filters/search-filter/search-facet-filter-options/search-facet-option/search-facet-option.component';
import { SearchFacetSelectedOptionComponent } from './search-filters/search-filter/search-facet-filter-options/search-facet-selected-option/search-facet-selected-option.component';
import { SearchFacetRangeOptionComponent } from './search-filters/search-filter/search-facet-filter-options/search-facet-range-option/search-facet-range-option.component';
import { SearchSwitchConfigurationComponent } from './search-switch-configuration/search-switch-configuration.component';
import { SearchAuthorityFilterComponent } from './search-filters/search-filter/search-authority-filter/search-authority-filter.component';
import { SearchLabelComponent } from './search-labels/search-label/search-label.component';
import { ConfigurationSearchPageComponent } from './configuration-search-page.component';
import { ConfigurationSearchPageGuard } from './configuration-search-page.guard';
import { SearchPageComponent } from './search-page.component';
import { SidebarFilterService } from '../shared/sidebar/filter/sidebar-filter.service';
import { StatisticsModule } from '../statistics/statistics.module';
import { SearchTrackerComponent } from './search-tracker.component';

const effects = [
  SidebarEffects
];

const components = [
  SearchPageComponent,
  SearchComponent,
  SearchResultsComponent,
  SearchSidebarComponent,
  SearchSettingsComponent,
  SearchFiltersComponent,
  SearchFilterComponent,
  SearchFacetFilterComponent,
  SearchLabelsComponent,
  SearchLabelComponent,
  SearchFacetFilterComponent,
  SearchFacetFilterWrapperComponent,
  SearchRangeFilterComponent,
  SearchTextFilterComponent,
  SearchHierarchyFilterComponent,
  SearchBooleanFilterComponent,
  SearchFacetOptionComponent,
  SearchFacetSelectedOptionComponent,
  SearchFacetRangeOptionComponent,
  SearchSwitchConfigurationComponent,
  SearchAuthorityFilterComponent,
  ConfigurationSearchPageComponent,
  SearchTrackerComponent,
];

@NgModule({
  imports: [
    SearchPageRoutingModule,
    CommonModule,
    SharedModule,
    EffectsModule.forFeature(effects),
    CoreModule.forRoot(),
    StatisticsModule.forRoot(),
  ],
  declarations: components,
  providers: [
    SidebarService,
    SidebarFilterService,
    SearchFilterService,
    SearchFixedFilterService,
    ConfigurationSearchPageGuard,
    SearchConfigurationService
  ],
  entryComponents: [
    SearchFacetFilterComponent,
    SearchRangeFilterComponent,
    SearchTextFilterComponent,
    SearchHierarchyFilterComponent,
    SearchBooleanFilterComponent,
    SearchFacetOptionComponent,
    SearchFacetSelectedOptionComponent,
    SearchFacetRangeOptionComponent,
    SearchAuthorityFilterComponent
  ],
  exports: components
})

/**
 * This module handles all components and pipes that are necessary for the search page
 */
export class SearchPageModule {
}
