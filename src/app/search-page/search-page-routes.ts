import { Route } from '@angular/router';

import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { I18nBreadcrumbsService } from '../core/breadcrumbs/i18n-breadcrumbs.service';
import { ConfigurationSearchPageGuard } from './configuration-search-page.guard';
import { ThemedConfigurationSearchPageComponent } from './themed-configuration-search-page.component';
import { ThemedSearchPageComponent } from './themed-search-page.component';

export const ROUTES: Route[] = [{
  path: '',
  resolve: { breadcrumb: I18nBreadcrumbResolver }, data: { title: 'search.title', breadcrumbKey: 'search' },
  providers: [
    I18nBreadcrumbResolver,
    I18nBreadcrumbsService,
  ],
  children: [
    { path: '', component: ThemedSearchPageComponent },
    {
      path: ':configuration',
      component: ThemedConfigurationSearchPageComponent,
      canActivate: [ConfigurationSearchPageGuard],
    },
  ],
}];
