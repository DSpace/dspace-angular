import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { LicenseContractPageComponent } from './license-contract-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', pathMatch: 'full',
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: {
          breadcrumbKey: 'contract',
        },
        component: LicenseContractPageComponent}
    ])
  ]
})
export class LicenseContractPageRoutingModule {
}
