import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyDSpacePageComponent } from './my-dspace-page.component';
import { MyDSpaceGuard } from './my-dspace.guard';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: MyDSpacePageComponent,
        resolve: {
          breadcrumb: I18nBreadcrumbResolver
        },
        data: { title: 'mydspace.title', breadcrumbKey: 'mydspace' },
        canActivate: [
          MyDSpaceGuard
        ]
      }
    ])
  ]
})
/**
 * This module defines the default component to load when navigating to the mydspace page path.
 */
export class MyDspacePageRoutingModule {
}
