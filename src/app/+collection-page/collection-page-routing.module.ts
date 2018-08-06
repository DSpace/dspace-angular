import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CollectionPageComponent } from './collection-page.component';
import { CollectionPageResolverService } from './collection-page-resolver.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        component: CollectionPageComponent,
        pathMatch: 'full',
        resolve: { collection: CollectionPageResolverService }
      }
    ])
  ],
  providers: [
    CollectionPageResolverService
  ]
})
export class CollectionPageRoutingModule {

}
