import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';
import { SearchPageRoutingModule } from './search-page-routing.module';
import { SearchPageComponent } from './search-page.component';
import { SearchResultsComponent } from './search-results/search-results.compontent';
import { SearchModule } from '../search/search.module';
import { ItemSearchResultListElementComponent } from '../object-list/search-result-list-element/item-search-result/item-search-result-list-element.component';
import { CollectionSearchResultListElementComponent } from '../object-list/search-result-list-element/collection-search-result/collection-search-result-list-element.component';
import { CommunitySearchResultListElementComponent } from '../object-list/search-result-list-element/community-search-result/community-search-result-list-element.component';

@NgModule({
  imports: [
    SearchPageRoutingModule,
    CommonModule,
    TranslateModule,
    RouterModule,
    SharedModule,
    SearchModule
  ],
  declarations: [
    SearchPageComponent,
    SearchResultsComponent,
    ItemSearchResultListElementComponent,
    CollectionSearchResultListElementComponent,
    CommunitySearchResultListElementComponent
  ],
  entryComponents: [
    ItemSearchResultListElementComponent,
    CollectionSearchResultListElementComponent,
    CommunitySearchResultListElementComponent
  ]
})
export class SearchPageModule { }
