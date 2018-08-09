import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SearchPageComponent } from './search-page.component';
import { SearchPagePreloader } from './search-page-preloader.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SearchPageComponent,
        data: { title: 'search.title' },
        canActivate: [SearchPagePreloader]
      }
    ])
  ],
  providers: [
    SearchPagePreloader
  ]
})
export class SearchPageRoutingModule {
}
