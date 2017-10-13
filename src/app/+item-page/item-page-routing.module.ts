import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ItemPageComponent } from './simple/item-page.component';
import { FullItemPageComponent } from './full/full-item-page.component';
import { NormalizedItem } from '../core/cache/models/normalized-item.model';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: ':id', component: ItemPageComponent, pathMatch: 'full', data: { type: NormalizedItem } },
      { path: ':id/full', component: FullItemPageComponent, data: { type: NormalizedItem } }
    ])
  ]
})
export class ItemPageRoutingModule {

}
