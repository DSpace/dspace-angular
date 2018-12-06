import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FullItemPageComponent } from './full/full-item-page.component';
import { ItemPageResolver } from './item-page.resolver';
import { ItemPageComponent } from './simple/item-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        component: ItemPageComponent,
        pathMatch: 'full',
        resolve: {
          item: ItemPageResolver
        }
      },
      {
        path: ':id/full',
        component: FullItemPageComponent,
        resolve: {
          item: ItemPageResolver
        }
      }
    ])
  ],
  providers: [
    ItemPageResolver,
  ]
})
export class ItemPageRoutingModule {

}
