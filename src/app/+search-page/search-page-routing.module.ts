import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SearchPageComponent } from './search-page.component';
import { FilteredSearchPageComponent } from './filtered-search-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: SearchPageComponent, data: { title: 'search.title' } },
      { path: ':filter', component: FilteredSearchPageComponent, data: { title: 'search.title.:filter' } }
    ])
  ]
})
export class SearchPageRoutingModule { }
