import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginPageComponent } from './login-page.component';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { I18nBreadcrumbsService } from '../core/breadcrumbs/i18n-breadcrumbs.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: LoginPageComponent, resolve: { breadcrumb: I18nBreadcrumbResolver }, data: { breadcrumbKey: 'login', title: 'login.title' } }
    ])
  ],
  providers: [
    I18nBreadcrumbResolver,
    I18nBreadcrumbsService
  ]
})
export class LoginPageRoutingModule {
}
