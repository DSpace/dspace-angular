import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SearchComponent } from './search.component';
import { ConfigurationSearchPageGuard } from './configuration-search-page.guard';
import { ConfigurationSearchPageComponent } from './configuration-search-page.component';
import { SearchPageComponent } from './search-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: SearchPageComponent, data: { title: 'search.title' } },
      { path: ':configuration', component: ConfigurationSearchPageComponent, canActivate: [ConfigurationSearchPageGuard]}
    ])
  ]
})
export class SearchPageRoutingModule {
}
