import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EndUserAgreementComponent } from './end-user-agreement/end-user-agreement.component';
import { getInfoModulePath } from '../app-routing.module';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';

const END_USER_AGREEMENT_PATH = 'end-user-agreement';

export function getEndUserAgreementPath() {
  return getSubPath(END_USER_AGREEMENT_PATH);
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
    ])
  ]
})
/**
 * Module for navigating to components within the info module
 */
export class InfoRoutingModule {
}
