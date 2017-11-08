import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SearchPageRoutingModule } from './search-page-routing.module';
import { SearchPageComponent } from './search-page.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { ItemSearchResultListElementComponent } from '../object-list/search-result-list-element/item-search-result/item-search-result-list-element.component';
import { CollectionSearchResultListElementComponent } from '../object-list/search-result-list-element/collection-search-result/collection-search-result-list-element.component';
import { CommunitySearchResultListElementComponent } from '../object-list/search-result-list-element/community-search-result/community-search-result-list-element.component';
import { SearchService } from './search-service/search.service';
import { SearchSidebarComponent } from './search-sidebar/search-sidebar.component';
import { SearchSidebarService } from './search-sidebar/search-sidebar.service';
import { SearchSidebarEffects } from './search-sidebar/search-sidebar.effects';
import { EffectsModule } from '@ngrx/effects';
import { SidebarFiltersComponent } from './search-filters/search-filters.component';
import { SidebarFilterComponent } from './search-filters/search-filter/search-filter.component';
import { SidebarFacetFilterComponent } from './search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { SearchFilterService } from './search-filters/search-filter/search-filter.service';

const effects = [
  SearchSidebarEffects
];

@NgModule({
  imports: [
    SearchPageRoutingModule,
    CommonModule,
    SharedModule,
    EffectsModule.forFeature(effects),
  ],
  declarations: [
    SearchPageComponent,
    SearchResultsComponent,
    SearchSidebarComponent,
    ItemSearchResultListElementComponent,
    CollectionSearchResultListElementComponent,
    CommunitySearchResultListElementComponent,
    SidebarFiltersComponent,
    SidebarFilterComponent,
    SidebarFacetFilterComponent
  ],
  providers: [
    SearchService,
    SearchSidebarService,
    SearchFilterService
  ],
  entryComponents: [
    ItemSearchResultListElementComponent,
    CollectionSearchResultListElementComponent,
    CommunitySearchResultListElementComponent
  ]
})
export class SearchPageModule { }
