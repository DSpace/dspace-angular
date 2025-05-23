import { Routes } from '@angular/router';

import { i18nBreadcrumbResolver } from '../../core/breadcrumbs/i18n-breadcrumb.resolver';
import { navigationBreadcrumbResolver } from '../../core/breadcrumbs/navigation-breadcrumb.resolver';
import { LdnServiceFormComponent } from './ldn-service-form/ldn-service-form.component';
import { LdnServicesOverviewComponent } from './ldn-services-directory/ldn-services-directory.component';

const moduleRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LdnServicesOverviewComponent,
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    data: { title: 'ldn-registered-services.title', breadcrumbKey: 'ldn-registered-services.new' },
  },
  {
    path: 'new',
    resolve: { breadcrumb: navigationBreadcrumbResolver },
    component: LdnServiceFormComponent,
    data: { title: 'ldn-register-new-service.title', breadcrumbKey: 'ldn-register-new-service' },
  },
  {
    path: 'edit/:serviceId',
    resolve: { breadcrumb: navigationBreadcrumbResolver },
    component: LdnServiceFormComponent,
    data: { title: 'ldn-edit-service.title', breadcrumbKey: 'ldn-edit-service' },
  },
];

export const ROUTES = moduleRoutes.map(route => {
  return { ...route, data: {
    ...route.data,
    relatedRoutes: moduleRoutes.filter(relatedRoute => relatedRoute.path !== route.path)
      .map((relatedRoute) => {
        return { path: relatedRoute.path, data: relatedRoute.data };
      }),
  } };
});
