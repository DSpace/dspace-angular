import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginPageComponent } from './login-page.component';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: LoginPageComponent, resolve: { breadcrumb: I18nBreadcrumbResolver }, data: { breadcrumbKey: 'login', title: 'login.title' } }
    ])
  ]
})
export class LoginPageRoutingModule {
}
