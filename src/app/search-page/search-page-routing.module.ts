import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SearchPageComponent } from './search-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'search', component: SearchPageComponent }
    ])
  ]
})
export class SearchPageRoutingModule { }
