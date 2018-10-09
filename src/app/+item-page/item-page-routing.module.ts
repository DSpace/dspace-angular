import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ItemPageComponent } from './simple/item-page.component';
import { FullItemPageComponent } from './full/full-item-page.component';
import { ItemPageResolver } from './item-page.resolver';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';

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
      },
      {
        path: ':id/edit',
        loadChildren: './edit-item-page/edit-item-page.module#EditItemPageModule',
        canActivate: [AuthenticatedGuard]
      }
    ])
  ],
  providers: [
    ItemPageResolver,
  ]
})
export class ItemPageRoutingModule {

}
