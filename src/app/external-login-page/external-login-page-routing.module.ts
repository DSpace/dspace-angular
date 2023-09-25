import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { I18nBreadcrumbsService } from '../core/breadcrumbs/i18n-breadcrumbs.service';
import { ThemedExternalLoginPageComponent } from './themed-external-login-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ThemedExternalLoginPageComponent,
    // resolve: { breadcrumb: I18nBreadcrumbResolver },
    // data: { breadcrumbKey: 'external-login', title: 'login.title' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    I18nBreadcrumbResolver,
    I18nBreadcrumbsService
  ]
})
export class ExternalLoginPageRoutingModule { }
