import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { ClarinLicensePageComponent } from './clarin-license-page/clarin-license-page.component';
import {
  SiteAdministratorGuard
} from '../core/data/feature-authorization/feature-authorization-guard/site-administrator.guard';
import { ClarinAllLicensesPageComponent } from './clarin-all-licenses-page/clarin-all-licenses-page.component';
import { LICENSES_MANAGE_TABLE_PATH } from '../app-routing-paths';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        children: [
          {
            path: '',
            resolve: { breadcrumb: I18nBreadcrumbResolver },
            component: ClarinAllLicensesPageComponent,
            data: {
              breadcrumbKey: 'licenses',
            }
          },
          {
            path: LICENSES_MANAGE_TABLE_PATH,
            component: ClarinLicensePageComponent,
            resolve: { breadcrumb: I18nBreadcrumbResolver },
            data: {
              breadcrumbKey: 'licenses.manage-table',
            },
            canActivate: [SiteAdministratorGuard],
          },
        ],
      },
    ])
  ]
})
export class ClarinLicenseRoutingModule {

}
