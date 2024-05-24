import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { MyDSpaceGuard } from './my-dspace.guard';
import { ThemedMyDSpacePageComponent } from './themed-my-dspace-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ThemedMyDSpacePageComponent,
        resolve: {
          breadcrumb: I18nBreadcrumbResolver,
        },
        data: { title: 'mydspace.title', breadcrumbKey: 'mydspace' },
        canActivate: [
          MyDSpaceGuard,
        ],
      },
    ]),
  ],
})
/**
 * This module defines the default component to load when navigating to the mydspace page path.
 */
export class MyDspacePageRoutingModule {
}
