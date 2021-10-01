import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import {SearchComponent} from './search/search.component';
import {LuckySearchModule} from './lucky-search.module';



@NgModule({
  imports: [
    LuckySearchModule,
    RouterModule.forChild([
      {
        path: '',
        data: {
          title: 'lucky-search',
        },
        children: [
          {
            path: '',
            component: SearchComponent,
          },
        ]
      },
    ])
  ]
})
export class SearchRoutingModule { }
