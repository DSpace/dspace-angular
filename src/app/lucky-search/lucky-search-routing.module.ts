import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LuckySearchComponent } from './search/lucky-search.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        data: {
          title: 'lucky-search',
        },
        children: [
          {
            path: '',
            component: LuckySearchComponent,
          },
        ]
      },
    ])
  ]
})
export class LuckySearchRoutingModule { }
