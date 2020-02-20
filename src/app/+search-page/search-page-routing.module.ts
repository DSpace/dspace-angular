import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ConfigurationSearchPageGuard } from './configuration-search-page.guard';
import { ConfigurationSearchPageComponent } from './configuration-search-page.component';
import { SearchPageComponent } from './search-page.component';
import { Breadcrumb } from '../breadcrumbs/breadcrumb/breadcrumb.model';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: SearchPageComponent, data: { title: 'search.title', breadcrumb: new Breadcrumb('Search', '/search') } },
      { path: ':configuration', component: ConfigurationSearchPageComponent, canActivate: [ConfigurationSearchPageGuard] }
    ])
  ]
})
export class SearchPageRoutingModule {
}
