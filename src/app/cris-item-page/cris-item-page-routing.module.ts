import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrisItemPageResolver } from './cris-item-page.resolver';
import { CrisItemPageComponent } from './cris-item-page.component';
import { ItemBreadcrumbResolver } from '../core/breadcrumbs/item-breadcrumb.resolver';

const routes: Routes = [
  {
    path: ':id',
    component: CrisItemPageComponent,
    resolve: {
      item: CrisItemPageResolver,
      breadcrumb: ItemBreadcrumbResolver
    },
    data: { showBreadcrumbsFluid: true }
  },
  { // used for activate specific tab
    path: ':id/:tab',
    component: CrisItemPageComponent,
    resolve: {
      item: CrisItemPageResolver,
      breadcrumb: ItemBreadcrumbResolver
    },
    data: { showBreadcrumbsFluid: true }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    CrisItemPageResolver,
    ItemBreadcrumbResolver
  ]
})
export class CrisItemPageRoutingModule { }
