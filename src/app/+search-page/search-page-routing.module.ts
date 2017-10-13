import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SearchPageComponent } from './search-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: SearchPageComponent, data: { title: 'DSpace Angular :: Search' } }
    ])
  ]
})
export class SearchPageRoutingModule { }
