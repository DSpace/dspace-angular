import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EndUserAgreementComponent } from './end-user-agreement/end-user-agreement.component';
import { getInfoModulePath } from '../app-routing-paths';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { PrivacyComponent } from './privacy/privacy.component';

const END_USER_AGREEMENT_PATH = 'end-user-agreement';
const PRIVACY_PATH = 'privacy';

export function getEndUserAgreementPath() {
  return getSubPath(END_USER_AGREEMENT_PATH);
}

export function getPrivacyPath() {
  return getSubPath(PRIVACY_PATH);
}

function getSubPath(path: string) {
  return `${getInfoModulePath()}/${path}`;
}

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: END_USER_AGREEMENT_PATH,
        component: EndUserAgreementComponent,
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: { title: 'info.end-user-agreement.title', breadcrumbKey: 'info.end-user-agreement' }
      }
    ]),
    RouterModule.forChild([
      {
        path: PRIVACY_PATH,
        component: PrivacyComponent,
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
