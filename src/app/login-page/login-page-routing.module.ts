import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { I18nBreadcrumbsService } from '../core/breadcrumbs/i18n-breadcrumbs.service';
import { ThemedLoginPageComponent } from './themed-login-page.component';
import { AuthFailedPageComponent } from './auth-failed-page/auth-failed-page.component';
import { MissingIdpHeadersComponent } from './missing-idp-headers/missing-idp-headers.component';
import { AutoregistrationComponent } from './autoregistration/autoregistration.component';
import { DuplicateUserErrorComponent } from './duplicate-user-error/duplicate-user-error.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: ThemedLoginPageComponent,
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: { breadcrumbKey: 'login', title: 'login.title' }
      },
      {
        path: 'auth-failed',
        pathMatch: 'full',
        component: AuthFailedPageComponent,
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: { breadcrumbKey: 'login', title: 'login.title' }
      },
      {
        path: 'missing-headers',
        pathMatch: 'full',
        component: MissingIdpHeadersComponent,
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: { breadcrumbKey: 'login', title: 'login.title' }
      },
      {
        path: 'autoregistration',
        pathMatch: 'full',
        component: AutoregistrationComponent,
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: { breadcrumbKey: 'login', title: 'login.title' }
      },
      {
        path: 'duplicate-user',
        pathMatch: 'full',
        component: DuplicateUserErrorComponent,
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: { breadcrumbKey: 'login', title: 'login.title' }
      }
    ])
  ],
  providers: [
    I18nBreadcrumbResolver,
    I18nBreadcrumbsService
  ]
})
export class LoginPageRoutingModule {
}
