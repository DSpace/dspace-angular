import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SearchPageComponent } from './search-page.component';
import { FilteredSearchPageComponent } from './filtered-search-page.component';
import { FilteredSearchPageGuard } from './filtered-search-page.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: SearchPageComponent, data: { title: 'search.title' } },
      { path: ':filter', component: FilteredSearchPageComponent, canActivate: [FilteredSearchPageGuard]}
    ])
  ]
})
export class SearchPageRoutingModule { }
