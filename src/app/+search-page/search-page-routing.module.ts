import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SearchPageComponent } from './search-page.component';
import { FilteredSearchPageComponent } from './filtered-search-page.component';
import { FilteredSearchPageGuard } from './filtered-search-page.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: SearchPageComponent, data: { title: 'DSpace Angular :: Search' } },
      { path: ':filter', component: FilteredSearchPageComponent, canActivate: [FilteredSearchPageGuard], data: { title: 'search.' }}
    ])
  ]
})
export class SearchPageRoutingModule { }
