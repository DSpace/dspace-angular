import { Route } from '@angular/router';

import { authenticatedGuard } from '../core/auth/authenticated.guard';
import { i18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { ProcessDetailComponent } from './detail/process-detail.component';
import { NewProcessComponent } from './new/new-process.component';
import { ProcessOverviewComponent } from './overview/process-overview.component';
import { processBreadcrumbResolver } from './process-breadcrumb.resolver';
import { processPageResolver } from './process-page.resolver';

export const ROUTES: Route[] = [
  {
    path: '',
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    data: { breadcrumbKey: 'process.overview' },
    canActivate: [authenticatedGuard],
    children: [
      {
        path: '',
        component: ProcessOverviewComponent,
        data: { title: 'process.overview.title' },
      },
      {
        path: 'new',
        component: NewProcessComponent,
        resolve: { breadcrumb: i18nBreadcrumbResolver },
        data: { title: 'process.new.title', breadcrumbKey: 'process.new' },
      },
      {
        path: ':id',
        component: ProcessDetailComponent,
        resolve: {
          process: processPageResolver,
          breadcrumb: processBreadcrumbResolver,
        },
      },
    ],
  },
];
