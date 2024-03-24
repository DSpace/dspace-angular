import { Route } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { ProcessDetailComponent } from './detail/process-detail.component';
import { NewProcessComponent } from './new/new-process.component';
import { ProcessOverviewComponent } from './overview/process-overview.component';
import { ProcessBreadcrumbResolver } from './process-breadcrumb.resolver';
import { ProcessPageResolver } from './process-page.resolver';

export const ROUTES: Route[] = [
  {
    path: '',
    resolve: { breadcrumb: I18nBreadcrumbResolver },
    data: { breadcrumbKey: 'process.overview' },
    canActivate: [AuthenticatedGuard],
    children: [
      {
        path: '',
        component: ProcessOverviewComponent,
        data: { title: 'process.overview.title' },
      },
      {
        path: 'new',
        component: NewProcessComponent,
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: { title: 'process.new.title', breadcrumbKey: 'process.new' },
      },
      {
        path: ':id',
        component: ProcessDetailComponent,
        resolve: {
          process: ProcessPageResolver,
          breadcrumb: ProcessBreadcrumbResolver,
        },
      },
    ],
  },
];
