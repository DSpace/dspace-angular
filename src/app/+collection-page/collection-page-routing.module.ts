import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CollectionPageComponent } from './collection-page.component';
import { CreateCollectionPageComponent } from './create-collection-page/create-collection-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'create', component: CreateCollectionPageComponent, canActivate: [AuthenticatedGuard] },
      { path: ':id', component: CollectionPageComponent, pathMatch: 'full' }
    ])
  ]
})
export class CollectionPageRoutingModule {

}
