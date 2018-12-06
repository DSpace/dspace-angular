import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';

import { SearchBooleanFilterComponent } from './search-filters/search-filter/search-boolean-filter/search-boolean-filter.component';
import { SearchFacetFilterWrapperComponent } from './search-filters/search-filter/search-facet-filter-wrapper/search-facet-filter-wrapper.component';
import { SearchFacetFilterComponent } from './search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { SearchFilterComponent } from './search-filters/search-filter/search-filter.component';
import { SearchFilterService } from './search-filters/search-filter/search-filter.service';
import { SearchHierarchyFilterComponent } from './search-filters/search-filter/search-hierarchy-filter/search-hierarchy-filter.component';
import { SearchRangeFilterComponent } from './search-filters/search-filter/search-range-filter/search-range-filter.component';
import { SearchTextFilterComponent } from './search-filters/search-filter/search-text-filter/search-text-filter.component';
import { SearchFiltersComponent } from './search-filters/search-filters.component';
import { SearchLabelsComponent } from './search-labels/search-labels.component';
import { SearchPageRoutingModule } from './search-page-routing.module';
import { SearchPageComponent } from './search-page.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { SearchConfigurationService } from './search-service/search-configuration.service';
import { SearchService } from './search-service/search.service';
import { SearchSettingsComponent } from './search-settings/search-settings.component';
import { SearchSidebarComponent } from './search-sidebar/search-sidebar.component';
import { SearchSidebarEffects } from './search-sidebar/search-sidebar.effects';
import { SearchSidebarService } from './search-sidebar/search-sidebar.service';
import { CoreModule } from '../core/core.module';
import { CollectionSearchResultGridElementComponent } from '../shared/object-grid/search-result-grid-element/collection-search-result/collection-search-result-grid-element.component';
import { CommunitySearchResultGridElementComponent } from '../shared/object-grid/search-result-grid-element/community-search-result/community-search-result-grid-element.component';
import { ItemSearchResultGridElementComponent } from '../shared/object-grid/search-result-grid-element/item-search-result/item-search-result-grid-element.component';
import { CollectionSearchResultListElementComponent } from '../shared/object-list/search-result-list-element/collection-search-result/collection-search-result-list-element.component';
import { CommunitySearchResultListElementComponent } from '../shared/object-list/search-result-list-element/community-search-result/community-search-result-list-element.component';
import { ItemSearchResultListElementComponent } from '../shared/object-list/search-result-list-element/item-search-result/item-search-result-list-element.component';
import { SharedModule } from '../shared/shared.module';

const effects = [
  SearchSidebarEffects
];

@NgModule({
  imports: [
    SearchPageRoutingModule,
    CommonModule,
    SharedModule,
    EffectsModule.forFeature(effects),
    CoreModule.forRoot()
  ],
  declarations: [
    SearchPageComponent,
    SearchResultsComponent,
    SearchSidebarComponent,
    SearchSettingsComponent,
    ItemSearchResultListElementComponent,
    CollectionSearchResultListElementComponent,
    CommunitySearchResultListElementComponent,
    ItemSearchResultGridElementComponent,
    CollectionSearchResultGridElementComponent,
    CommunitySearchResultGridElementComponent,
    CommunitySearchResultListElementComponent,
    SearchFiltersComponent,
    SearchFilterComponent,
    SearchFacetFilterComponent,
    SearchLabelsComponent,
    SearchFacetFilterComponent,
    SearchFacetFilterWrapperComponent,
    SearchRangeFilterComponent,
    SearchTextFilterComponent,
    SearchHierarchyFilterComponent,
    SearchBooleanFilterComponent,
  ],
  providers: [
    SearchService,
    SearchSidebarService,
    SearchFilterService,
    SearchConfigurationService
  ],
  entryComponents: [
    ItemSearchResultListElementComponent,
    CollectionSearchResultListElementComponent,
    CommunitySearchResultListElementComponent,
    ItemSearchResultGridElementComponent,
    CollectionSearchResultGridElementComponent,
    CommunitySearchResultGridElementComponent,
    SearchFacetFilterComponent,
    SearchRangeFilterComponent,
    SearchTextFilterComponent,
    SearchHierarchyFilterComponent,
    SearchBooleanFilterComponent,
  ]
})

/**
 * This module handles all components and pipes that are necessary for the search page
 */
export class SearchPageModule {
}
