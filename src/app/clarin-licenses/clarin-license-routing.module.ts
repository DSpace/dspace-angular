import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { ClarinLicensePageComponent } from './clarin-license-page/clarin-license-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: {
          breadcrumbKey: 'licenses',
        },
        component: ClarinLicensePageComponent,
        pathMatch: 'full'
      }
    ])
  ]
})
export class ClarinLicenseRoutingModule {

}
