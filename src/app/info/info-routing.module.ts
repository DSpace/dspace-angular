import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { PRIVACY_PATH, END_USER_AGREEMENT_PATH } from './info-routing-paths';
import { ThemedEndUserAgreementComponent } from './end-user-agreement/themed-end-user-agreement.component';
import { ThemedPrivacyComponent } from './privacy/themed-privacy.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: END_USER_AGREEMENT_PATH,
        component: ThemedEndUserAgreementComponent,
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: { title: 'info.end-user-agreement.title', breadcrumbKey: 'info.end-user-agreement' }
      }
    ]),
    RouterModule.forChild([
      {
        path: PRIVACY_PATH,
        component: ThemedPrivacyComponent,
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: { title: 'info.privacy.title', breadcrumbKey: 'info.privacy' }
      }
    ])
  ]
})
/**
 * Module for navigating to components within the info module
 */
export class InfoRoutingModule {
}
