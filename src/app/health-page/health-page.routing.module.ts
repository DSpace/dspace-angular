import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { SiteAdministratorGuard } from '../core/data/feature-authorization/feature-authorization-guard/site-administrator.guard';
import { HealthPageComponent } from './health-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: {
          breadcrumbKey: 'health',
          title: 'health-page.title',
        },
        canActivate: [SiteAdministratorGuard],
        component: HealthPageComponent,
      },
    ]),
  ],
})
export class HealthPageRoutingModule {

}
