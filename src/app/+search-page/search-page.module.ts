import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';
import { SearchPageRoutingModule } from './search-page-routing.module';
import { SearchPageComponent } from './search-page.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { ItemSearchResultListElementComponent } from '../object-list/search-result-list-element/item-search-result/item-search-result-list-element.component';
import { CollectionSearchResultListElementComponent } from '../object-list/search-result-list-element/collection-search-result/collection-search-result-list-element.component';
import { CommunitySearchResultListElementComponent } from '../object-list/search-result-list-element/community-search-result/community-search-result-list-element.component';
import { SearchService } from './search.service';

@NgModule({
  imports: [
    SearchPageRoutingModule,
    CommonModule,
    TranslateModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    SearchPageComponent,
    SearchResultsComponent,
    ItemSearchResultListElementComponent,
    CollectionSearchResultListElementComponent,
    CommunitySearchResultListElementComponent
  ],
  providers: [
    SearchService
  ],
  entryComponents: [
    ItemSearchResultListElementComponent,
    CollectionSearchResultListElementComponent,
    CommunitySearchResultListElementComponent
  ]
})
export class SearchPageModule { }
